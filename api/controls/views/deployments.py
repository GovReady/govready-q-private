from api.base.views.base import SerializerClasses
from api.base.views.viewsets import ReadOnlyViewSet
from api.controls.serializers.deployment import SimpleDeploymentSerializer
from controls.models import Deployment


class DeploymentViewSet(ReadOnlyViewSet):
    queryset = Deployment.objects.all()

    serializer_classes = SerializerClasses(retrieve=SimpleDeploymentSerializer,
                                           list=SimpleDeploymentSerializer)

    NESTED_ROUTER_PKS = [{'pk': 'systems_pk', 'model_field': 'system'}]

