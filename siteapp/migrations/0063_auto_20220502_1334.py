# Generated by Django 3.2.13 on 2022-05-02 13:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('siteapp', '0062_remove_proposal_system'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposal',
            name='criteria_comment',
            field=models.TextField(blank=True, help_text='Comments on this proposal.', null=True),
        ),
        migrations.AlterField(
            model_name='proposal',
            name='status',
            field=models.TextField(blank=True, help_text='Status of the proposal.', null=True),
        ),
    ]
