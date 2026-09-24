from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Organization


class OrganizationApiTests(APITestCase):

    def setUp(self):
        self.category = Category.objects.create(name='Здравоохранение')
        self.organization = Organization.objects.create(
            name='Евпаторийская детская поликлиника',
            category=self.category,
            address='ул. Некрасова, 85',
            phone='+7 (36569) 3-11-69',
            description='Тестовая организация',
        )

    def test_list_is_public(self):
        response = self.client.get('/api/organizations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_is_case_insensitive(self):
        for query in ('поликлиника', 'ПОЛИКЛИНИКА', 'Поликлиника'):
            response = self.client.get('/api/organizations/',
                                       {'search': query})
            names = [item['name'] for item in response.data]
            self.assertIn(self.organization.name, names,
                          msg=f'Запрос "{query}" не нашёл организацию')

    def test_response_includes_category_name(self):
        response = self.client.get('/api/organizations/')
        self.assertEqual(response.data[0]['category_name'], 'Здравоохранение')

    def test_detail_returns_organization(self):
        response = self.client.get(
            f'/api/organizations/{self.organization.id}/'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['name'],
            'Евпаторийская детская поликлиника'
        )

    def test_filter_by_category(self):
        response = self.client.get(
            '/api/organizations/',
            {'category': self.category.id}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]['id'],
            self.organization.id
        )

    def test_search_by_address(self):
        response = self.client.get(
            '/api/organizations/',
            {'search': 'Некрасова'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ids = [item['id'] for item in response.data]
        self.assertIn(self.organization.id, ids)

    def test_detail_returns_404_for_missing_organization(self):
        response = self.client.get('/api/organizations/-1/')

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )
