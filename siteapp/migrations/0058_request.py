# Generated by Django 3.2.12 on 2022-04-18 11:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('controls', '0069_alter_element_require_approval'),
        ('siteapp', '0057_auto_20220331_1650'),
    ]

    operations = [
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated', models.DateTimeField(auto_now=True, db_index=True, null=True)),
                ('criteria_comment', models.TextField(blank=True, help_text='Comments on this request.', null=True)),
                ('criteria_reject_comment', models.TextField(blank=True, help_text='Comment on request rejection.', null=True)),
                ('status', models.TextField(blank=True, help_text='Status of the request.', null=True)),
                ('requested_element', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='request', to='controls.element')),
                ('system', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='request', to='controls.system')),
                ('user', models.ForeignKey(blank=True, help_text='User creating the request.', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='request', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
