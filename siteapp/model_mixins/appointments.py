from django.db import models
from django.http import JsonResponse

class AppointmentModelMixin(models.Model):
    appointments = models.ManyToManyField("siteapp.Appointment", related_name="%(class)s")

    class Meta:
        abstract = True

    def add_appointments(self, appointments):
        if appointments is None:
            appointments = []
        elif isinstance(appointments, str):
            appointments = [appointments]
        assert isinstance(appointments, list)
        self.appointments.add(*appointments)

    def remove_appointments(self, appointments=None):
        if appointments is None:
            appointments = []
        elif isinstance(appointments, str):
            appointments = [appointments]
        assert isinstance(appointments, list)
        self.appointments.remove(*appointments)

# class AppointmentView:

#     @staticmethod
#     def add_role(request, obj_id, role_id, model):
#         from siteapp.models import Role
#         try:
#             role = Role.objects.get(id=role_id)
#         except Role.DoesNotExist:
#             return JsonResponse({"status": "error", "message": f"Role does not exist"}, status=404)
#         model.objects.get(id=obj_id).add_roles(roles=[role])
#         return JsonResponse({"status": "ok", "data": role.serialize()}, status=201)

#     @staticmethod
#     def remove_role(request, obj_id, role_id, model):
#         from siteapp.models import Role
#         try:
#             role = Role.objects.get(id=role_id)
#         except Role.DoesNotExist:
#             return JsonResponse({"status": "error", "message": f"Role does not exist"}, status=404)
#         model.objects.get(id=obj_id).remove_roles(roles=[role])
#         return JsonResponse({"status": "ok"})

#     @staticmethod
#     def list_roles(request, obj_id, model):
#         roles = []
#         for role in model.objects.get(id=obj_id).roles.all().iterator():
#             roles.append(role.serialize())
#         return JsonResponse({"status": "ok", "data": roles})

# def build_tag_urls(path_prefix, model):
#     from django.conf.urls import url
#     return [
#         url(rf'{path_prefix}tags/(\d+)/_add$', lambda *args, **kwargs: TagView.add_tag(*args, model, **kwargs),
#             name=f"add_tag_to_{model.__name__.lower()}"),
#         url(rf'{path_prefix}tags/(\d+)/_remove$',
#             lambda *args, **kwargs: TagView.remove_tag(*args, model, **kwargs),
#             name=f"remove_tag_from_{model.__name__.lower()}"),
#         url(rf'{path_prefix}tags/$', lambda *args, **kwargs: TagView.list_tags(*args, model, **kwargs),
#             name=f"list_element_{model.__name__.lower()}"),
#     ]