# Generated by Django 3.2.13 on 2022-05-16 12:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('siteapp', '0064_proposal_req'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposal',
            name='req',
            field=models.OneToOneField(blank=True, help_text='Request associated with this proposal.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='proposal', to='siteapp.request'),
        ),
    ]
