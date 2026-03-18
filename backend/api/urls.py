# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SongViewSet

router = DefaultRouter() 
router.register(r'user', UserViewSet)
router.register(r'song', SongViewSet, basename='song') 

urlpatterns = [
    path('', include(router.urls)),
]
