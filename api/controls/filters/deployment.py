from api.base.filters import BaseFilterSet, FilterFields
from controls.models import Deployment
from rest_framework_filters import filters

class DeploymentFilter(BaseFilterSet):
    # author = filters.RelatedFilter(UserFilter, queryset=User.objects.all())
    name = filters.AutoFilter(lookups=FilterFields.String)

    class Meta:
        model = Deployment
        fields = []