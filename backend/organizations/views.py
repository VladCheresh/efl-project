from rest_framework.viewsets import ReadOnlyModelViewSet
from django_filters.rest_framework import DjangoFilterBackend

from .models import Organization, Category
from .serializers import OrganizationSerializer, CategorySerializer
from .filters import OrganizationFilter


class OrganizationViewSet(ReadOnlyModelViewSet):
    queryset = Organization.objects.select_related('category')
    serializer_class = OrganizationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = OrganizationFilter


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
