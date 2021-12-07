from api.base.permissions import CustomObjectPermissions
from api.base.views.base import SerializerClasses
from api.base.views.viewsets import ReadOnlyViewSet
from api.siteapp.serializers.portfolios import SimplePortfolioWithRoleSerializer
from siteapp.models import Portfolio
from rest_framework_guardian import filters

class PortfolioViewSet(ReadOnlyViewSet):
    queryset = Portfolio.objects.all()
    serializer_classes = SerializerClasses(retrieve=SimplePortfolioWithRoleSerializer,
                                           list=SimplePortfolioWithRoleSerializer)
    permission_classes = [CustomObjectPermissions]
    extra_filter_backends = [filters.ObjectPermissionsFilter]
