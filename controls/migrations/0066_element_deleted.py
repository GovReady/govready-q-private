# Generated by Django 3.2.10 on 2022-01-06 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('controls', '0065_auto_20211006_0240'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='deleted',
            field=models.BooleanField(default=False, help_text='Mark Component as deleted'),
        ),
    ]
