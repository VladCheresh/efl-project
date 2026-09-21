from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone', 'is_staff', 'date_joined')
    fieldsets = UserAdmin.fieldsets + (('Дополнительно',
                                        {'fields': ('phone',)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (('Дополнительно', {'fields':
                                                                  ('phone',)}),
                                               )
