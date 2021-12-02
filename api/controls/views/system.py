from api.base.views.base import SerializerClasses
from api.base.views.viewsets import ReadOnlyViewSet
from api.controls.serializers.element import SimpleElementControlSerializer, DetailedElementControlSerializer
from api.controls.serializers.statements import PoamStatmentSerializer
from api.controls.serializers.system import DetailedSystemSerializer, SimpleSystemSerializer
from api.controls.serializers.system_assement_results import DetailedSystemAssessmentResultSerializer, \
    SimpleSystemAssessmentResultSerializer
from controls.models import System, ElementControl, SystemAssessmentResult, Statement
from api.base.views.mixins import CustomSearchModelMixin
from django.db.models import Q

class SystemViewSet(ReadOnlyViewSet):
    queryset = System.objects.all()

    serializer_classes = SerializerClasses(retrieve=DetailedSystemSerializer,
                                           list=SimpleSystemSerializer)

class SystemControlsViewSet(ReadOnlyViewSet):
    queryset = ElementControl.objects.all()

    serializer_classes = SerializerClasses(retrieve=DetailedElementControlSerializer,
                                           list=SimpleElementControlSerializer)

    NESTED_ROUTER_PKS = [{'pk': 'systems_pk', 'model_field': 'element.system'}]


class SystemAssessmentViewSet(ReadOnlyViewSet):
    queryset = SystemAssessmentResult.objects.all()

    serializer_classes = SerializerClasses(retrieve=DetailedSystemAssessmentResultSerializer,
                                           list=SimpleSystemAssessmentResultSerializer)

    NESTED_ROUTER_PKS = [{'pk': 'systems_pk', 'model_field': 'system'}]


class SystemPoamStatementsViewSet(CustomSearchModelMixin, ReadOnlyViewSet):
    queryset = Statement.objects.all()
    ordering = ('-updated', )
    serializer_classes = SerializerClasses(retrieve=PoamStatmentSerializer,
                                           list=PoamStatmentSerializer)

    NESTED_ROUTER_PKS = [{'pk': 'systems_pk', 'model_field': 'consumer_element.system'}]

    def get_queryset(self, queryset=None, serializer_class=None):        
        queryset = super().get_queryset(queryset, serializer_class)
        return queryset.filter(statement_type="POAM")

    def search(self, request, keyword):
        return Q(poam__weakness_name__icontains=keyword) | Q(poam__poam_id__icontains=keyword.lower().replace("v-", ""))