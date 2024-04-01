from django.urls import path
from .consumers import MyConsumer

websocket_urlpatterns = [
    path('ws/api/', MyConsumer.as_asgi()),
]