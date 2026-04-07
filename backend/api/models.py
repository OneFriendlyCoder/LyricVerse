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
        ('user', 'User'),
        ('verifier', 'Label'),
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
    

    

    
class Genre(models.Model):

    GENRE_CHOICES = BOLLYWOOD_GENRE_CHOICES = [
        ('romantic', 'Romantic'),
        ('dance', 'Dance / Party'),
        ('sad', 'Sad / Emotional'),
        ('item', 'Item Song'),
        ('qawwali', 'Qawwali'),
        ('ghazal', 'Ghazal'),
        ('classical', 'Classical'),
        ('folk', 'Folk'),
        ('patriotic', 'Patriotic'),
        ('devotional', 'Devotional'),
        ('rap', 'Rap / Hip-Hop'),
        ('remix', 'Remix'),
        ('sufi', 'Sufi'),
        ('indie', 'Indie / Non-Film'),
    ]    
    name = models.CharField(
        max_length=20,
        choices=BOLLYWOOD_GENRE_CHOICES,
        default='romantic'
    )

    def __str__(self):
        return self.name
    
class LabelSong(models.Model):
    # Links to the label who uploaded it
    Rating =[1,2,3,4,5]
    label_account = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='label_songs',blank=False,null=False)
    
    title = models.CharField(max_length=200,blank=False)
    artist = models.CharField(max_length=200)
    movie = models.CharField(max_length=200, blank=True)
    rating = models.FloatField(choices=[(i, i) for i in Rating], blank=True, null=True)
    genre = models.CharField(max_length=50, blank=True, choices=Genre.GENRE_CHOICES)
    original_language = models.CharField(max_length=50, default='English', choices=User.LANGUAGE_CHOICES)
    
    # One simple text field for the official lyrics. No line-by-line database rows needed!
    official_lyrics = models.TextField() 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (Official Label Release)"

    
class Languages(models.Model):
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('hi', 'Hindi'),
        ('mr', 'Marathi'),
        ('ta', 'Tamil'),
        ('bn', 'Bengali'),
    ]
    name = models.CharField(
        max_length=10,
        choices=LANGUAGE_CHOICES,
        default='en'
    )

    def __str__(self):
        return self.name    
