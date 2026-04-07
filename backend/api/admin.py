from django.contrib import admin
from api.models import Song, User, LabelSong, Genre, Languages


# Register your models here.
admin.site.register(User)
admin.site.register(Song)
admin.site.register(LabelSong)
admin.site.register(Genre)
admin.site.register(Languages)