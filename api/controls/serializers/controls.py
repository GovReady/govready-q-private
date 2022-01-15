from api.base.serializers.types import ReadOnlySerializer
from api.controls.serializers.element import DetailedElementSerializer
from controls.models import CommonControlProvider, CommonControl, ElementCommonControl
from controls.oscal import CatalogData
from rest_framework import serializers

class SimpleCommonControlProviderSerializer(ReadOnlySerializer):
    class Meta:
        model = CommonControlProvider
        fields = ['name', 'description']


class SimpleCommonControlSerializer(ReadOnlySerializer):
    class Meta:
        model = CommonControl
        fields = ['name', 'description', 'oscal_ctl_id', 'legacy_imp_smt']


class DetailedCommonControlSerializer(SimpleCommonControlSerializer):
    common_control_provider = SimpleCommonControlProviderSerializer()

    class Meta:
        model = CommonControl
        fields = SimpleCommonControlSerializer.Meta.fields + ['common_control_provider']


class SimpleElementCommonControlSerializer(ReadOnlySerializer):
    class Meta:
        model = ElementCommonControl
        fields = ['oscal_ctl_id', 'oscal_catalog_key']


class DetailedElementCommonControlSerializer(SimpleElementCommonControlSerializer):
    element = DetailedElementSerializer()
    common_control = DetailedCommonControlSerializer()

    class Meta:
        model = ElementCommonControl
        fields = SimpleElementCommonControlSerializer.Meta.fields + ['element', 'common_control']


class CatalogDataReadSerializer(ReadOnlySerializer):

    title = serializers.SerializerMethodField()

    def get_title(self, obj):
        return obj.catalog_json['catalog']['metadata']['title'].strip()

    class Meta:
        model = CatalogData
        fields = ['catalog_key', 'title']

class CatalogDataGroup(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()

class CatalogDataWithGroupReadSerializer(CatalogDataReadSerializer):
    groups = serializers.SerializerMethodField()

    def get_groups(self, obj):
        return [CatalogDataGroup(x).data for x in obj.catalog_json['catalog'].get('groups', [])]

    class Meta:
        model = CatalogData
        fields = CatalogDataReadSerializer.Meta.fields + ['groups']