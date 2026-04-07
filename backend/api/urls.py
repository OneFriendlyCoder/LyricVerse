# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SongViewSet, GenreViewSet, LanguagesViewSet

router = DefaultRouter() 
router.register(r'user', UserViewSet)
router.register(r'song', SongViewSet, basename='song') 
router.register(r'genre', GenreViewSet)
router.register(r'languages', LanguagesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
