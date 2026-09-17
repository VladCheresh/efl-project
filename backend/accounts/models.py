from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Номер телефона'
    )

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
