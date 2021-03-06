# Generated by Django 3.2.13 on 2022-06-14 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('siteapp', '0066_alter_project_tags'),
        ('controls', '0073_auto_20220516_1548'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='appointments',
            field=models.ManyToManyField(blank=True, related_name='element', to='siteapp.Appointment'),
        ),
        migrations.AlterField(
            model_name='element',
            name='requests',
            field=models.ManyToManyField(blank=True, related_name='element', to='siteapp.Request'),
        ),
        migrations.AlterField(
            model_name='element',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='element', to='siteapp.Tag'),
        ),
        migrations.AlterField(
            model_name='system',
            name='proposals',
            field=models.ManyToManyField(blank=True, related_name='system', to='siteapp.Proposal'),
        ),
        migrations.AlterField(
            model_name='system',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='system', to='siteapp.Tag'),
        ),
    ]
