import argparse
import csv
import os
import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parent.parent
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
sys.path.insert(0, str(BACKEND_DIR))

import django  # noqa: E402

django.setup()

from django.contrib.auth import get_user_model  # noqa: E402
from django.db import transaction  # noqa: E402

from api.models import Genre, LabelSong, User  # noqa: E402


LANGUAGE_LOOKUP = {
    code.lower(): code
    for code, _ in User.LANGUAGE_CHOICES
}
LANGUAGE_LOOKUP.update(
    {
        label.lower(): code
        for code, label in User.LANGUAGE_CHOICES
    }
)

GENRE_LOOKUP = {
    code.lower(): code
    for code, _ in Genre.GENRE_CHOICES
}
GENRE_LOOKUP.update(
    {
        label.lower(): code
        for code, label in Genre.GENRE_CHOICES
    }
)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Bulk import LabelSong rows from a CSV file."
    )
    parser.add_argument(
        "--csv",
        default=str(Path(__file__).resolve().parent / "songs.csv"),
        help="Path to the CSV file. Defaults to backend/scripts/songs.csv",
    )
    parser.add_argument(
        "--label-username",
        help="Username of the label account to assign to every row.",
    )
    parser.add_argument(
        "--label-id",
        type=int,
        help="User ID of the label account to assign to every row.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate the CSV and print the result without saving anything.",
    )
    parser.add_argument(
        "--allow-duplicates",
        action="store_true",
        help="Insert rows even if a matching song already exists for the label account.",
    )
    return parser.parse_args()


def normalize_value(value):
    return (value or "").strip()


def resolve_label(row, default_username=None, default_id=None):
    row_label_id = normalize_value(row.get("label_id"))
    row_label_username = normalize_value(row.get("label_username"))

    if row_label_id:
        return get_user_model().objects.filter(id=row_label_id).first()
    if row_label_username:
        return get_user_model().objects.filter(username=row_label_username).first()
    if default_id:
        return get_user_model().objects.filter(id=default_id).first()
    if default_username:
        return get_user_model().objects.filter(username=default_username).first()
    return None


def normalize_language(raw_language):
    value = normalize_value(raw_language)
    if not value:
        return "en"
    return LANGUAGE_LOOKUP.get(value.lower())


def normalize_genre(raw_genre):
    value = normalize_value(raw_genre)
    if not value:
        return ""
    return GENRE_LOOKUP.get(value.lower())


def normalize_rating(raw_rating):
    value = normalize_value(raw_rating)
    if not value:
        return None

    try:
        rating = float(value)
    except ValueError:
        return None

    if rating not in {1.0, 2.0, 3.0, 4.0, 5.0}:
        return None
    return rating


def load_rows(csv_path, default_username=None, default_id=None, allow_duplicates=False):
    songs_to_create = []
    errors = []
    skipped_duplicates = 0

    with open(csv_path, newline="", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file)
        required_headers = {"title", "artist", "official_lyrics"}

        if not reader.fieldnames:
            raise ValueError("CSV file is empty or missing a header row.")

        missing_headers = required_headers - set(reader.fieldnames)
        if missing_headers:
            raise ValueError(
                f"CSV is missing required columns: {', '.join(sorted(missing_headers))}"
            )

        for row_number, row in enumerate(reader, start=2):
            title = normalize_value(row.get("title"))
            artist = normalize_value(row.get("artist"))
            movie = normalize_value(row.get("movie"))
            official_lyrics = normalize_value(row.get("official_lyrics"))
            label_account = resolve_label(row, default_username, default_id)
            genre = normalize_genre(row.get("genre"))
            language = normalize_language(row.get("original_language"))
            rating = normalize_rating(row.get("rating"))

            if not title:
                errors.append(f"Row {row_number}: title is required.")
                continue
            if not artist:
                errors.append(f"Row {row_number}: artist is required.")
                continue
            if not official_lyrics:
                errors.append(f"Row {row_number}: official_lyrics is required.")
                continue
            if not label_account:
                errors.append(
                    f"Row {row_number}: label account not found. Provide --label-username, --label-id, or CSV label_username/label_id."
                )
                continue
            if not language:
                errors.append(
                    f"Row {row_number}: invalid original_language '{row.get('original_language')}'."
                )
                continue
            if normalize_value(row.get("genre")) and not genre:
                errors.append(f"Row {row_number}: invalid genre '{row.get('genre')}'.")
                continue
            if normalize_value(row.get("rating")) and rating is None:
                errors.append(
                    f"Row {row_number}: invalid rating '{row.get('rating')}'. Use 1 to 5."
                )
                continue

            if not allow_duplicates:
                duplicate_exists = LabelSong.objects.filter(
                    label_account=label_account,
                    title=title,
                    artist=artist,
                    movie=movie,
                ).exists()
                if duplicate_exists:
                    skipped_duplicates += 1
                    continue

            songs_to_create.append(
                LabelSong(
                    label_account=label_account,
                    title=title,
                    artist=artist,
                    movie=movie,
                    rating=rating,
                    genre=genre,
                    original_language=language,
                    official_lyrics=official_lyrics,
                )
            )

    return songs_to_create, errors, skipped_duplicates


def main():
    args = parse_args()
    csv_path = Path(args.csv).resolve()

    if not csv_path.exists():
        print(f"CSV file not found: {csv_path}")
        sys.exit(1)

    songs_to_create, errors, skipped_duplicates = load_rows(
        csv_path=csv_path,
        default_username=args.label_username,
        default_id=args.label_id,
        allow_duplicates=args.allow_duplicates,
    )

    if errors:
        print("Import failed with validation errors:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)

    if args.dry_run:
        print(
            f"Dry run complete. {len(songs_to_create)} songs ready to import, {skipped_duplicates} duplicates skipped."
        )
        return

    with transaction.atomic():
        LabelSong.objects.bulk_create(songs_to_create, batch_size=500)

    print(
        f"Imported {len(songs_to_create)} label songs from {csv_path}. {skipped_duplicates} duplicates skipped."
    )


if __name__ == "__main__":
    main()
