# Generated by Django 5.0.2 on 2024-03-03 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_alter_boardgamespace_spaceboardid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='boardgamespace',
            name='spaceColor',
            field=models.TextField(blank=True, default=None),
        ),
    ]
