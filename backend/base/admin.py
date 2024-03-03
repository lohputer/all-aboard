from django.contrib import admin
from .models import BoardGame, Currency, BoardGameSpace


class CurrencyInline(admin.TabularInline):
    model = Currency


class BoardGameSpaceInline(admin.TabularInline):
    model = BoardGameSpace


@admin.register(BoardGame)
class BoardGameAdmin(admin.ModelAdmin):
    inlines = [CurrencyInline, BoardGameSpaceInline]
