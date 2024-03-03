# Generated by Django 5.0.2 on 2024-03-03 18:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_boardgamespace_spaceboardid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='boardgamespace',
            name='spaceBoardID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.boardgame'),
        ),
        migrations.AlterField(
            model_name='currency',
            name='currencyBoardID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.boardgame'),
        ),
    ]
