import os
import shutil

from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction, models
from django.db.utils import OperationalError
from django.conf import settings
from pathlib import PurePath

class Command(BaseCommand):
    """Create an empty integration from a model integrations directory"""

    help = 'Create an empty integration from a model integrations directory'

    def add_arguments(self, parser):
        parser.add_argument('integration_name', nargs='?', type=str)

    def handle(self, *args, **options):

        # Configure
        integration_name = options['integration_name']
        self.stdout.write(f"integration_name is '{integration_name}'")
        integrations_dir = os.path.join('integrations', integration_name)

        # Fail if integration_name already exists
        if os.path.exists(integrations_dir):
            raise CommandError(f"Integration named '{integration_name}' already exists.")
            return
        
        # Copy stub files

        # Make integrations directory
        shutil.copytree(os.path.join('integrations', 'management', 'commands', 'example_stub'), integrations_dir, copy_function=shutil.copy)
        self.stdout.write(f"Integration folder created")

        self.stdout.write(f"Integration '{integration_name}' created.")
        return
        
