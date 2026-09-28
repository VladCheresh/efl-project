import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


User = get_user_model()


class Command(BaseCommand):
    help = ('Создаёт суперпользователя из переменных окружения '
            'DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_PASSWORD '
            'и DJANGO_SUPERUSER_EMAIL (необязательная)')

    def handle(self, *args, **options):
        """Создаёт администратора, если его ещё нет.

        Команду можно запускать при каждом деплое: существующего
        пользователя она не трогает, пароль не меняет.
        """
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')

        # Без переменных ничего не делаем и не падаем:
        # entrypoint.sh работает с set -e,
        # а локально и на других окружениях
        # администратора создают через createsuperuser
        if not username or not password:
            self.stdout.write(
                'Суперпользователь не создан: переменные окружения не заданы'
            )
            return

        # Обычный createsuperuser --noinput при повторном запуске падает
        # с ошибкой «логин занят»,
        # из-за set -e сервис не запустился бы.
        if User.objects.filter(username=username).exists():
            self.stdout.write('Суперпользователь уже существует, пропускаем')
            return

        User.objects.create_superuser(
            username=username, email=email, password=password
        )
        self.stdout.write(self.style.SUCCESS('Суперпользователь создан'))
