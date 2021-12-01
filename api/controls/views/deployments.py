from api.base.views.base import SerializerClasses
from api.base.views.viewsets import ReadOnlyViewSet
from api.base.views.mixins import CustomSearchModelMixin
from api.controls.serializers.deployment import SimpleDeploymentSerializer
from controls.models import Deployment
from django.db.models import Q


class DeploymentViewSet(CustomSearchModelMixin, ReadOnlyViewSet):
    queryset = Deployment.objects.all()

    serializer_classes = SerializerClasses(retrieve=SimpleDeploymentSerializer,
                                           list=SimpleDeploymentSerializer)

    NESTED_ROUTER_PKS = [{'pk': 'systems_pk', 'model_field': 'system'}]

    def search(self, request, keyword):
        return Q(name__icontains=keyword)

