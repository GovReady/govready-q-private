# Generated by Django 3.2.13 on 2022-05-15 20:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system_settings', '0010_auto_20210713_1031'),
    ]

    operations = [
        migrations.AlterField(
            model_name='systemsettings',
            name='details',
            field=models.JSONField(blank=True, default=dict, help_text='Value objects of System Setting in JSON', null=True),
        ),
    ]
