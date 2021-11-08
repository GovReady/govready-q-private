from rest_framework import permissions
from rest_framework import serializers
from rest_framework import viewsets
from .oscal import CatalogData

class ControlMatrixSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogData
        fields = ['catalog_key', 'controlmatrix_json']
