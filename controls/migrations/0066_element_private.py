# Generated by Django 3.2.12 on 2022-02-25 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('controls', '0065_auto_20211006_0240'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='private',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
