from django.contrib.auth import get_user_model, password_validation
from rest_framework import serializers


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Регистрация нового пользователя."""
    # Пароль исключительно для записи, в ответ никогда не попадает
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'phone']

    def create(self, validated_data):
        # create_user хеширует пароль,
        # обычный create сохранил бы его открытым текстом
        return User.objects.create_user(**validated_data)

    def validate_password(self, value):
        # create_user хеширует пароль,
        # но правила надёжности (длина, только цифры и т.д.
        # из AUTH_PASSWORD_VALIDATORS) не проверяет,
        # поэтому вызываем валидаторы вручную
        password_validation.validate_password(value)
        return value


class UserSerializer(serializers.ModelSerializer):
    """Данные текущего пользователя (без пароля)."""
    class Meta:
        model = User
        fields = ['id', 'username', 'phone']
