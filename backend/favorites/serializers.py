from rest_framework import serializers
from .models import Favorite
from organizations.serializers import OrganizationSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    organization_detail = OrganizationSerializer(source='organization',
                                                 read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'organization', 'organization_detail', 'created_at']
        read_only_fields = ['created_at']

    def validate(self, attrs):
        request = self.context.get('request')
        organization = attrs.get('organization')
        if request and Favorite.objects.filter(
            user=request.user, organization=organization
        ).exists():
            raise serializers.ValidationError(
                {'organization': 'Эта организация уже в избранном.'}
            )
        return attrs
