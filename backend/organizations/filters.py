from django_filters import FilterSet, NumberFilter, CharFilter, BooleanFilter
from django.db import models

from .models import Organization


class OrganizationFilter(FilterSet):
    category = NumberFilter(field_name='category_id')
    search = CharFilter(method='filter_search')
    is_favorite = BooleanFilter(method='filter_is_favorite')

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(address__icontains=value)
        )

    def filter_is_favorite(self, queryset, name, value):
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none() if value else queryset

        if value:
            return queryset.filter(favorited_by__user=user)
        return queryset.exclude(favorited_by__user=user)

    class Meta:
        model = Organization
        fields = ['category', 'search', 'is_favorite']
