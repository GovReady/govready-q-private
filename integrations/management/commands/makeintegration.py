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
        # Rename Communication subclass
        try:
            # Update communicate.py
            with open(os.path.join(integrations_dir, 'communicate.py'), "r+") as f:
                orig_file = f.read()
                new_file = orig_file.replace('ExampleCommunication', f'{integration_name.title()}Communication')
                new_file = new_file.replace("https://example.com/api", f"https://{integration_name}.com/api")
                f.seek(0)
                f.write(new_file)
                f.truncate()
            print(f"File {os.path.join(integrations_dir, 'communicate.py')} updated")
        except:
            print(f"Error updating {os.path.join(integrations_dir, 'communicate.py')}")
        try:
            # Update views.py
            with open(os.path.join(integrations_dir, 'views.py'), "r+") as f:
                orig_file = f.read()
                new_file = orig_file.replace('ExampleCommunication', f'{integration_name.title()}Communication')
                new_file = new_file.replace("INTEGRATION_NAME = 'example'", f"INTEGRATION_NAME = '{integration_name}'")
                new_file = new_file.replace("INTEGRATION_SYSTEM_ID = 'example_system_id'", f"INTEGRATION_SYSTEM_ID = '{integration_name}_system_id'")
                new_file = new_file.replace("return ExampleCommunication()", f"return {integration_name}Communication()")
                new_file = new_file.replace("IntegrationStub", f"{integration_name}")
                f.seek(0)
                f.write(new_file)
                f.truncate()
            print(f"File {os.path.join(integrations_dir, 'views.py')} updated")
        except:
            print(f"Error updating {os.path.join(integrations_dir, 'views.py')}")
        try:
            # Update README.md
            with open(os.path.join(integrations_dir, 'README.md'), "r+") as f:
                orig_file = f.read()
                new_file = orig_file.replace('example', f'{integration_name}')
                f.seek(0)
                f.write(new_file)
                f.truncate()
            print(f"File {os.path.join(integrations_dir, 'README.md')} updated")
        except:
            print(f"Error updating {os.path.join(integrations_dir, 'README.md')}")
        try:
            # Update mock.py
            with open(os.path.join(integrations_dir, 'mock.py'), "r+") as f:
                orig_file = f.read()
                new_file = orig_file.replace('example', f'{integration_name}')
                f.seek(0)
                f.write(new_file)
                f.truncate()
            print(f"File {os.path.join(integrations_dir, 'mock.py')} updated")
        except:
            print(f"Error updating {os.path.join(integrations_dir, 'mock.py')}")

        return
        
