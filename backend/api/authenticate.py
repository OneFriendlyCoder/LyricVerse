# api/authenticate.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # 1. Try to get the token from the cookie we set during login
        raw_token = request.COOKIES.get('access_token') or None
        
        # If there's no cookie, refuse authentication
        if raw_token is None:
            return None

        # 2. If the cookie exists, validate it and log the user in!
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token