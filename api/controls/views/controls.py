from api.base.views.base import SerializerClasses
from api.base.views.viewsets import ReadOnlyViewSet
from api.base.views.mixins import CustomSearchModelMixin
from api.controls.serializers.controls import CatalogDataReadSerializer
from controls.oscal import CatalogData
from django.db.models import Q


class ControlsViewSet(CustomSearchModelMixin, ReadOnlyViewSet):
    queryset = CatalogData.objects.all()

    serializer_classes = SerializerClasses(retrieve=CatalogDataReadSerializer,
                                           list=CatalogDataReadSerializer)

    # NESTED_ROUTER_PKS = [{'pk': 'systems_pk', 'model_field': 'system'}]

    def get_queryset(self, queryset=None, serializer_class=None):
        queryset = super().get_queryset(queryset, serializer_class)
        return queryset.filter()

    def search(self, request, keyword):
        return Q(catalog_key__icontains=keyword) | Q(catalog_json__catalog__metadata__title__icontains=keyword)
