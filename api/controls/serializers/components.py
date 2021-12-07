from api.base.serializers.types import ReadOnlySerializer
from api.controls.serializers.system import DetailedSystemSerializer
from controls.models import Element


class SimpleComponentSerializer(ReadOnlySerializer):
    class Meta:
        model = Element
        fields = ['uuid']
        # fields = ['uuid', 'name', 'full_name', 'description', 'element_type', 'component_type', 'component', 'component_state']


class DetailedDeploymentSerializer(SimpleComponentSerializer):
    system = DetailedSystemSerializer()

    class Meta:
        model = Element
        fields = SimpleComponentSerializer.Meta.fields + ['system']
