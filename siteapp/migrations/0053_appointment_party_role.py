# Generated by Django 3.2.12 on 2022-03-29 11:53

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('siteapp', '0052_merge_0049_auto_20210423_1555_0051_auto_20210822_0328'),
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated', models.DateTimeField(auto_now=True, db_index=True, null=True)),
                ('role_id', models.CharField(blank=True, max_length=16, null=True, validators=[django.core.validators.RegexValidator(regex='^[a-zA-Z_][a-zA-Z0-9_\\-.]*$')])),
                ('title', models.CharField(help_text='Title of Role.', max_length=250)),
                ('short_name', models.CharField(blank=True, help_text='Short name of this Role.', max_length=100, null=True)),
                ('description', models.TextField(blank=True, help_text='Description of this Role.', null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Party',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated', models.DateTimeField(auto_now=True, db_index=True, null=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, help_text='A UUID (a unique identifier) for this Party.')),
                ('party_type', models.CharField(help_text='type for Party.', max_length=100)),
                ('name', models.CharField(help_text='Name of this Party.', max_length=250, unique=True)),
                ('short_name', models.CharField(help_text='Short name of this Party.', max_length=100)),
                ('user', models.ForeignKey(blank=True, help_text='User associated with the Party.', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='party', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated', models.DateTimeField(auto_now=True, db_index=True, null=True)),
                ('model_name', models.CharField(help_text='The Model name to which the Role and Party are appointed.', max_length=100)),
                ('comment', models.CharField(help_text='Notes on this Appointment.', max_length=200)),
                ('party', models.ForeignKey(help_text='The Party appointed to the Role.', on_delete=django.db.models.deletion.CASCADE, to='siteapp.party')),
                ('role', models.ForeignKey(help_text='The Role being appointed.', on_delete=django.db.models.deletion.CASCADE, to='siteapp.role')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
