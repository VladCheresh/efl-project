from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """Обработка регистрации пользователя."""
    serializer_class = RegisterSerializer
    # Регистрация обычно нужна неавторизованным пользователям,
    # поэтому даем разрешение для всех (AllowAny)
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    """Данные текущего авторизованного пользователя"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # В адресе нет id, поэтому DRF не знает, какой объект отдавать.
        # Возвращаем пользователя из токена:
        # запросить чужой профиль станет невозможным.
        return self.request.user
