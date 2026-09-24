from rest_framework import viewsets, permissions, mixins
from .models import Favorite
from .serializers import FavoriteSerializer


class FavoriteViewSet(mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    """Избранное текущего пользователя.

    Доступно только добавление, список и удаление. Изменять запись
    нельзя (PUT/PATCH дают 405): избранное либо есть, либо нет.
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Только записи текущего пользователя. Поиск записи для DELETE идёт
        # через этот же queryset, поэтому чужая запись не находится и
        # даёт 404, а не 403. select_related подтягивает организацию
        # и категорию заранее, чтобы organization_detail не делал
        # запрос на каждую запись.
        return (Favorite.objects
                .filter(user=self.request.user)
                .select_related('organization__category'))

    def perform_create(self, serializer):
        # Пользователь берется из запроса (не из тела),
        # чтобы не было возможности подставить чужого пользователя
        serializer.save(user=self.request.user)
