# Generated by Django 3.2.13 on 2022-04-29 13:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('controls', '0070_auto_20220418_1140'),
        ('siteapp', '0060_auto_20220418_1508'),
    ]

    operations = [
        migrations.CreateModel(
            name='Proposal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated', models.DateTimeField(auto_now=True, db_index=True, null=True)),
                ('criteria_comment', models.TextField(blank=True, help_text='Comments on this request.', null=True)),
                ('status', models.TextField(blank=True, help_text='Status of the request.', null=True)),
                ('requested_element', models.ForeignKey(blank=True, help_text='Element being proposed for request.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='propose', to='controls.element')),
                ('system', models.ForeignKey(blank=True, help_text='System making the request proposal.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='propose', to='controls.system')),
                ('user', models.ForeignKey(blank=True, help_text='User creating the request proposal.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='propose', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
