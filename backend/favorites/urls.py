from rest_framework.routers import DefaultRouter
from .views import FavoriteViewSet

router = DefaultRouter()
router.register('favorites', FavoriteViewSet, basename='favorite')

urlpatterns = router.urls
