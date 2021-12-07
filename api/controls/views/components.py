from api.base.views.base import SerializerClasses
from api.base.views.viewsets import ReadOnlyViewSet
from api.base.views.mixins import CustomSearchModelMixin
from api.controls.serializers.components import SimpleComponentSerializer
from controls.models import Element
from django.db.models import Q


class ComponentsViewSet(CustomSearchModelMixin, ReadOnlyViewSet):
    queryset = Element.objects.all()

    serializer_classes = SerializerClasses(retrieve=SimpleComponentSerializer,
                                           list=SimpleComponentSerializer)

    # NESTED_ROUTER_PKS = [{'pk': 'systems_pk', 'model_field': 'system'}]

    def get_queryset(self, queryset=None, serializer_class=None):
        queryset = super().get_queryset(queryset, serializer_class)
        return queryset.filter()

    def search(self, request, keyword):
        return Q(name__icontains=keyword)
