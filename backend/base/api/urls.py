from django.urls import path
from . import views
from .views import ObtainTokenView, register_user, createGame

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', ObtainTokenView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register_user'),
    path('create/', createGame, name='createGame'),
]