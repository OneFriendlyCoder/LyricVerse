from rest_framework import serializers
from .models import User, Song, Languages, Genre

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','first_name', 'preferred_language', 'email', 'bio','role']

class LanguagesSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source='get_name_display')

    class Meta:
        model = Languages
        fields = ['name','display_name']

class GenreSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source='get_name_display')
    class Meta:
        model = Genre
        fields = ['display_name','name']

class SongSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Song
        fields = [
            'id', 'title', 'artist', 'movie', 'rating', 'genre', 
            'original_language', 'original_lyrics', 'created_at', 
            'status', 'author', 'author_username'
        ]
        # These fields cannot be modified directly via standard POST/PUT requests
        read_only_fields = ['author', 'created_at', 'status']