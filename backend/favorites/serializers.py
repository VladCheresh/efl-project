from rest_framework import serializers
from .models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'organization', 'created_at']
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
