from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class RegistrationTests(APITestCase):
    """Регистрация: валидация пароля и создание пользователя."""

    url = '/api/auth/register/'

    def test_weak_password_is_rejected(self):
        response = self.client.post(self.url, {
            'username': 'weakuser',
            'password': '1',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        self.assertFalse(User.objects.filter(username='weakuser').exists())

    def test_valid_registration_creates_user(self):
        response = self.client.post(self.url, {
            'username': 'newuser',
            'password': 'Str0ng-Password!',
            'phone': '+7 900 000-00-00',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_duplicate_username_is_rejected(self):
        first_response = self.client.post(self.url, {
            'username': 'newuser',
            'password': 'Str0ng-Password!',
        })
        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)

        second_response = self.client.post(self.url, {
            'username': 'newuser',
            'password': 'Str0ng-Password!'
        })
        self.assertEqual(second_response.status_code,
                         status.HTTP_400_BAD_REQUEST)


class AuthTokenTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='authuser',
                                             password='Str0ng-Password!')

    def test_login_returns_access_and_refresh(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'authuser',
            'password': 'Str0ng-Password!',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_wrong_password_fails(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'authuser',
            'password': 'Wr0ng-Password!'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_returns_new_access_token(self):
        login_response = self.client.post('/api/auth/login/', {
            'username': 'authuser',
            'password': 'Str0ng-Password!',
        })
        refresh_token = login_response.data['refresh']

        response = self.client.post('/api/auth/login/refresh/', {
            'refresh': refresh_token,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_me_requires_authentication(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_current_user(self):
        login_response = self.client.post('/api/auth/login/', {
            'username': 'authuser',
            'password': 'Str0ng-Password!'
        })
        access_token = login_response.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get('/api/auth/me/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'authuser')
