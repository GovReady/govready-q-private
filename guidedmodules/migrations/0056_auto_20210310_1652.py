# Generated by Django 3.0.11 on 2021-03-10 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('controls', '0045_auto_20210228_1431'),
        ('guidedmodules', '0055_auto_20210309_1503'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appversion',
            name='input_artifacts',
            field=models.ManyToManyField(blank=True, help_text='The objects created from this input.', related_name='import_records', to='controls.ImportRecord'),
        ),
    ]
