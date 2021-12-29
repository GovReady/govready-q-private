from django.apps import AppConfig


class ControlConfig(AppConfig):
    name = 'controls'

    def ready(self):
        import controls.signals