"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from base.consumers import ChatConsumer
application = ProtocolTypeRouter({
    "websocket": URLRouter([
        path('ws/chat/', ChatConsumer.as_asgi()),
    ]),
}
)