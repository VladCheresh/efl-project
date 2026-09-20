from rest_framework import viewsets, permissions, mixins
from .models import Favorite
from .serializers import FavoriteSerializer


class FavoriteViewSet(mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (Favorite.objects
                .filter(user=self.request.user)
                .select_related('organization__category'))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
