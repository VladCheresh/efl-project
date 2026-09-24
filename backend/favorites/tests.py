from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from organizations.models import Category, Organization
from .models import Favorite

User = get_user_model()


class FavoriteApiTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='user1',
                                             password='Str0ng-Password!')
        self.other_user = User.objects.create_user(username='user2',
                                                   password='an0therPassword!')
        self.category = Category.objects.create(name='Здравоохранение')
        self.organization = Organization.objects.create(
            name='Евпаторийская детская поликлиника',
            category=self.category,
            address='ул. Некрасова, 85',
            phone='+7 (36569) 3-11-69',
            description='Тестовая организация',
        )
        self.other_organization = Organization.objects.create(
            name='Евпаторийская городская больница',
            category=self.category,
            address='проспект Победы, 34',
            phone='+7 (36569) 3-13-67',
            description='Ещё одна тестовая организация',
        )

    def test_list_requires_authentication(self):
        response = self.client.get('/api/favorites/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_requires_authentication(self):
        response = self.client.post('/api/favorites/', {
            'organization': self.organization.id
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(Favorite.objects.
                         filter(organization=self.organization).exists())

    def test_authenticated_user_can_add_favorite(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/favorites/', {
            'organization': self.organization.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Favorite.objects.filter(
                user=self.user,
                organization=self.organization
            ).exists()
        )
        self.assertEqual(response.data['organization'], self.organization.id)

    def test_list_returns_only_own_favorites(self):
        Favorite.objects.create(
            user=self.user,
            organization=self.organization
        )
        Favorite.objects.create(
            user=self.other_user,
            organization=self.other_organization
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/favorites/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['organization'],
                         self.organization.id)

    def test_duplicate_favorite_is_rejected(self):
        Favorite.objects.create(user=self.user, organization=self.organization)

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/favorites/', {
            'organization': self.organization.id
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('organization', response.data)
        self.assertEqual(Favorite.objects.filter(user=self.user).count(), 1)

    def test_cannot_delete_other_users_favorite(self):
        favorite = Favorite.objects.create(
            user=self.other_user,
            organization=self.organization
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f'/api/favorites/{favorite.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Favorite.objects.filter(id=favorite.id).exists())

    def test_user_can_delete_own_favorite(self):
        favorite = Favorite.objects.create(
            user=self.user,
            organization=self.organization
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f'/api/favorites/{favorite.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Favorite.objects.filter(id=favorite.id).exists())

    def test_update_methods_are_not_allowed(self):
        favorite = Favorite.objects.create(
            user=self.user,
            organization=self.organization
        )

        self.client.force_authenticate(user=self.user)
        url = f'/api/favorites/{favorite.id}/'
        data = {'organization': self.other_organization.id}

        put_response = self.client.put(url, data)
        patch_response = self.client.patch(url, data)

        self.assertEqual(put_response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(patch_response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)
        favorite.refresh_from_db()
        self.assertEqual(favorite.organization, self.organization)
