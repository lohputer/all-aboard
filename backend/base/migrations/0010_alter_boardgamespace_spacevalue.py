# Generated by Django 5.0.1 on 2024-03-05 03:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_boardgamespace_spacevalue'),
    ]

    operations = [
        migrations.AlterField(
            model_name='boardgamespace',
            name='spaceValue',
            field=models.JSONField(),
        ),
    ]
