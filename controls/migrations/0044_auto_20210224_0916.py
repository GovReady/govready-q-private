# Generated by Django 3.1.6 on 2021-02-24 09:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('controls', '0043_merge_20210203_1543'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='description',
            field=models.CharField(blank=True, help_text='Brief description of the Element', max_length=255, null=True),
        ),
    ]
