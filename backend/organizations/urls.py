from rest_framework.routers import DefaultRouter

from .views import OrganizationViewSet, CategoryViewSet


router = DefaultRouter()

router.register('organizations', OrganizationViewSet)
router.register('categories', CategoryViewSet)

urlpatterns = router.urls
