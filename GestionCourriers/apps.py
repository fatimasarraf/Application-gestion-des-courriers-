from django.apps import AppConfig


class GestioncourriersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'GestionCourriers'

    def ready(self):
        import GestionCourriers.signals
