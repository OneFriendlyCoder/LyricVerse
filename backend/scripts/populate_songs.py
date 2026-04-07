    # your_app/management/commands/seed_songs.py



from django.core.management.base import BaseCommand
from api.models import LabelSong
import random
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
django.setup()


BOLLYWOOD_SONGS = [
    {"title": "Tum Hi Ho", "artist": "Arijit Singh", "genre": "romantic"},
    {"title": "Chaiyya Chaiyya", "artist": "Sukhwinder Singh", "genre": "dance"},
    {"title": "Kal Ho Naa Ho", "artist": "Sonu Nigam", "genre": "sad"},
    {"title": "Sheila Ki Jawani", "artist": "Sunidhi Chauhan", "genre": "item"},
    {"title": "Kun Faya Kun", "artist": "A.R. Rahman", "genre": "sufi"},
    {"title": "Mohe Rang Do Laal", "artist": "Shreya Ghoshal", "genre": "classical"},
    {"title": "Nagada Sang Dhol", "artist": "Shreya Ghoshal", "genre": "folk"},
    {"title": "Ae Watan", "artist": "Arijit Singh", "genre": "patriotic"},
    {"title": "Bhar Do Jholi", "artist": "Adnan Sami", "genre": "qawwali"},
    {"title": "Aaj Blue Hai Paani", "artist": "Yo Yo Honey Singh", "genre": "dance"},
    {"title": "Apna Time Aayega", "artist": "Ranveer Singh", "genre": "rap"},
    {"title": "Tera Ban Jaunga", "artist": "Akhil Sachdeva", "genre": "romantic"},
    {"title": "Agar Tum Saath Ho", "artist": "Alka Yagnik", "genre": "sad"},
    {"title": "Dilbar", "artist": "Neha Kakkar", "genre": "remix"},
    {"title": "Kun Faya Kun", "artist": "Javed Ali", "genre": "sufi"},
]


class Command(BaseCommand):
    help = "Seed database with Bollywood songs"

    def handle(self, *args, **kwargs):
        created_count = 0

        for song in BOLLYWOOD_SONGS:
            obj, created = LabelSong.objects.get_or_create(
                title=song["title"],
                artist=song["artist"],
                defaults={"genre": song["genre"]}
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ Successfully added {created_count} Bollywood songs!"
        ))