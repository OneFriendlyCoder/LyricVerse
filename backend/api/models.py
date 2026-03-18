from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Custom User model to extend Django's built-in user with additional fields
class User(AbstractUser):

    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('hi', 'Hindi'),
        ('mr', 'Marathi'),
        ('ta', 'Tamil'),
        ('bn', 'Bengali'),
    ]

    ROLE_CHOICES = [
        ('user', 'Normal User'),
        ('verifier', 'Verifier'),
    ]

    preferred_language = models.CharField(
        max_length=10,
        choices=LANGUAGE_CHOICES,
        default='en'
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='user'
    )

    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
    

class Song(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PENDING', 'Pending'),
        ('PUBLISHED', 'Published'),
    ]
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='songs')
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    movie = models.CharField(max_length=200, blank=True)
    rating = models.FloatField(blank=True, null=True)
    genre = models.CharField(max_length=15, blank=True)
    original_language = models.CharField(max_length=50, blank=False, null=False, default='English')
    original_lyrics = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    def __str__(self):
        return self.title
    



