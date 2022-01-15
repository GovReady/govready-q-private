from api.base.serializers.types import ReadOnlySerializer
from siteapp.models import Portfolio
from rest_framework import serializers

class SimplePortfolioSerializer(ReadOnlySerializer):
    class Meta:
        model = Portfolio
        fields = ['title', 'description']

class SimplePortfolioWithRoleSerializer(ReadOnlySerializer):
    role = serializers.SerializerMethodField()

    def get_role(self, obj):
        if self.context['request'].user.has_perm('can_grant_portfolio_owner_permission', obj):
            return "Owner"
        elif self.context['request'].user.has_perm('change_portfolio', obj):
            return "Portfolio Member"
        return "Project Member"

    class Meta:
        model = Portfolio
        fields = ['title', 'description', 'role']

