from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('login/refresh/', TokenRefreshView.as_view()),
    path('me/', MeView.as_view()),
]
