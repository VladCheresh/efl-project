from rest_framework import serializers
from .models import Category, Organization


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class OrganizationSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name',
                                          read_only=True)

    class Meta:
        model = Organization
        fields = ['id', 'name', 'category', 'category_name', 'address',
                  'phone', 'description', 'is_favorite']

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return False
        if not hasattr(request, '_favorite_ids'):
            request._favorite_ids = set(
                request.user.favorites.values_list('organization_id',
                                                   flat=True)
            )
        return obj.id in request._favorite_ids
