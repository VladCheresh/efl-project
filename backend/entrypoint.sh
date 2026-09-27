#!/bin/sh
set -e

python manage.py collectstatic --noinput
python manage.py migrate --noinput
python manage.py import_organizations data/organizations_import.csv

exec gunicorn vdzh.wsgi:application --bind 0.0.0.0:${PORT:-8000}
