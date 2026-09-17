import csv

from django.core.management.base import BaseCommand, CommandError

from organizations.models import Category, Organization


class Command(BaseCommand):
    help = ('Импортирует организации из CSV-файла '
            '(name,category,address,phone,description)')

    def add_arguments(self, parser):
        parser.add_argument('csv_path', type=str, help='Путь к CSV-файлу')

    def handle(self, *args, **options):
        csv_path = options['csv_path']

        try:
            file = open(csv_path, encoding='utf-8')
        except FileNotFoundError:
            raise CommandError(f'Файл не найден: {csv_path}')

        reader = csv.DictReader(file)
        created_count = 0
        skipped_count = 0

        for row in reader:
            category_name = row['category'].strip()
            category, _ = Category.objects.get_or_create(name=category_name)

            organization, created = Organization.objects.get_or_create(
                name=row['name'].strip(),
                address=row['address'].strip(),
                defaults={
                    'category': category,
                    'phone': row['phone'].strip(),
                    'description': row['description'].strip(),
                },
            )

            if created:
                created_count += 1
            else:
                skipped_count += 1

        file.close()

        self.stdout.write(
            self.style.SUCCESS(
                'Импорт завершён: '
                f'создано {created_count}, '
                f'пропущено (уже есть) {skipped_count}'
            )
        )
