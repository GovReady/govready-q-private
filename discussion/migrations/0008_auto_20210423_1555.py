# Generated by Django 3.1.8 on 2021-04-23 15:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('discussion', '0007_auto_20201103_1330'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attachment',
            name='updated',
            field=models.DateTimeField(auto_now=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='updated',
            field=models.DateTimeField(auto_now=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='discussion',
            name='updated',
            field=models.DateTimeField(auto_now=True, db_index=True, null=True),
        ),
    ]
