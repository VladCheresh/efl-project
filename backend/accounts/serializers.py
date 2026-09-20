from django.contrib.auth import get_user_model, password_validation
from rest_framework import serializers


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'phone']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'phone']
