from api.base.views.base import SerializerClasses
from api.base.views.viewsets import ReadOnlyViewSet
from api.guidedmodules.serializers.app import SimpleAppVersionSourceSerializer, DetailedAppVersionSerializer
from guidedmodules.models import AppVersion


class AppVersionViewSet(ReadOnlyViewSet):
    queryset = AppVersion.objects.all()
    serializer_classes = SerializerClasses(retrieve=SimpleAppVersionSourceSerializer, list=SimpleAppVersionSourceSerializer)