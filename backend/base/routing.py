from django.urls import url
from base.consumers import *

websocket_urlpatterns = [
    url(r'^ws/chat/(?P<room_name>[^/]+)/$', RoomConsumer),
]