from rest_framework import serializers
from .models import Category, Organization


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class OrganizationSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'name', 'category', 'address', 'phone', 'description',
                  'is_favorite']

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False
