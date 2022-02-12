from api.base.views.base import SerializerClasses
from api.base.views.viewsets import ReadOnlyViewSet
from api.base.views.mixins import CustomSearchModelMixin
from api.controls.serializers.controls import CatalogDataReadSerializer, CatalogDataWithGroupReadSerializer, SimpleCommonControlSerializer
from controls.oscal import CatalogData
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response
from controls.oscal import CatalogData

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

class CatalogDataViewSet(CustomSearchModelMixin, ReadOnlyViewSet):
    queryset =  CatalogData.objects.all()   
    serializer_classes = SerializerClasses(retrieve=CatalogDataWithGroupReadSerializer,
                                           list=CatalogDataWithGroupReadSerializer)

    def search(self, request, keyword):
        return Q(catalog_key__icontains=keyword) | Q(catalog_json__catalog__metadata__title__icontains=keyword)

    @action(detail=True, url_path="catalog-key", methods=["GET"])
    def retrieve_by_catalog_key(self, request, **kwargs):
        obj = CatalogData.objects.get(catalog_key=kwargs.get('pk'))
        serializer = CatalogDataWithGroupReadSerializer(obj)
        return Response(serializer.data)
