from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('organizations.urls')),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('favorites.urls')),
]
