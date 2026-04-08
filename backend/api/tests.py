from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Song


User = get_user_model()


class SongWorkflowTests(APITestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            username="writer_one",
            password="testpass123",
            role="user",
        )
        self.other_user = User.objects.create_user(
            username="reader_two",
            password="testpass123",
            role="user",
        )

    def create_song(self, status_value="DRAFT"):
        return Song.objects.create(
            author=self.author,
            title="Midnight Rain",
            genre="indie",
            original_language="en",
            original_lyrics="Walking through the midnight rain",
            status=status_value,
        )

    def test_submit_then_final_publish_transitions_song(self):
        song = self.create_song()
        self.client.force_authenticate(user=self.author)

        submit_response = self.client.post(reverse("song-submit", args=[song.id]))

        self.assertEqual(submit_response.status_code, status.HTTP_200_OK)
        song.refresh_from_db()
        self.assertEqual(song.status, "PENDING")
        self.assertEqual(submit_response.data["status"], "PENDING")

        final_publish_response = self.client.post(reverse("song-final-publish", args=[song.id]))

        self.assertEqual(final_publish_response.status_code, status.HTTP_200_OK)
        song.refresh_from_db()
        self.assertEqual(song.status, "PUBLISHED")
        self.assertEqual(final_publish_response.data["status"], "PUBLISHED")

    def test_public_song_list_exposes_pending_and_published_only(self):
        draft_song = self.create_song(status_value="DRAFT")
        pending_song = self.create_song(status_value="PENDING")
        pending_song.title = "Open For Annotation"
        pending_song.save(update_fields=["title"])
        published_song = self.create_song(status_value="PUBLISHED")
        published_song.title = "Final Song"
        published_song.save(update_fields=["title"])

        response = self.client.get(reverse("song-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        returned_ids = {item["id"] for item in response.data}
        self.assertNotIn(draft_song.id, returned_ids)
        self.assertIn(pending_song.id, returned_ids)
        self.assertIn(published_song.id, returned_ids)

    def test_published_song_is_locked_from_author_edits(self):
        song = self.create_song(status_value="PUBLISHED")
        self.client.force_authenticate(user=self.author)

        response = self.client.patch(
            reverse("song-detail", args=[song.id]),
            {"title": "Changed Title"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        song.refresh_from_db()
        self.assertEqual(song.title, "Midnight Rain")
