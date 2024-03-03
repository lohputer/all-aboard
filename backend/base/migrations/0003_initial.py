# Generated by Django 5.0.2 on 2024-03-02 01:33

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('base', '0002_delete_profile'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BoardGame',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('desc', models.TextField()),
                ('rules', models.TextField()),
                ('publicity', models.BooleanField(default=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BoardGameSpace',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spaceName', models.TextField()),
                ('spaceColor', models.TextField()),
                ('spaceImage', models.ImageField(upload_to='')),
                ('spaceType', models.TextField()),
                ('spaceBoardID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.boardgame')),
            ],
        ),
        migrations.CreateModel(
            name='Currency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('currencyType', models.TextField()),
                ('currencyImage', models.ImageField(upload_to='')),
                ('currencyBoardID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.boardgame')),
            ],
        ),
    ]
