from django.contrib import admin
from .models import *

admin.site.register(UserProfile)
admin.site.register(BoardGame)
admin.site.register(Currency)
admin.site.register(BoardGameSpace)
admin.site.register(GameLayout)