from rest_framework import serializers
from .models import User, Song

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','first_name', 'preferred_language', 'email', 'bio','role']


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