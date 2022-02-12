from api.base.serializers.types import ReadOnlySerializer
# from api.controls.serializers.system import DetailedSystemSerializer
from controls.models import Element, Statement
from api.controls.serializers.statements import SimpleStatementSerializer, DetailedStatementSerializer
from api.siteapp.serializers.tags import SimpleTagSerializer


class SimpleComponentSerializer(ReadOnlySerializer):
    class Meta:
        model = Element
        fields = ['uuid', 'name', 'description', 'element_type', 'created', 'updated', 'component_type', 'component_state']

class DetailedComponentSerializer(SimpleComponentSerializer):    
    tags = SimpleTagSerializer(many=True)
    statements_produced = SimpleStatementSerializer(many=True)
    class Meta:
        model = Element
        fields = SimpleComponentSerializer.Meta.fields + ['tags', 'statements_produced']