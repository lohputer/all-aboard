# Generated by Django 5.0.1 on 2024-04-05 10:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_remove_room_created_at_remove_room_token_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat',
            name='image',
        ),
    ]