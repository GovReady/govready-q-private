# Generated by Django 3.2.5 on 2021-10-02 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('guidedmodules', '0059_merge_20211002_1239'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moduleasset',
            name='updated',
            field=models.DateTimeField(auto_now=True, db_index=True),
        ),
    ]
