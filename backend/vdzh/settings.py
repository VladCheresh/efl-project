import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta


BASE_DIR = Path(__file__).resolve().parent.parent

# Переменные окружения (ключ, БД, хосты) читаются из .env
# Сам .env в репозиторий не попадет, а шаблон лежит в .env.example
load_dotenv(BASE_DIR / '.env')


# Значения по умолчанию нет намеренно:
# без ключа в .env Django не запустится,
# а не заработает с небезопасным запасным ключом.
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
)

# По умолчанию отладка выключена:
# включить ее можно только явной строкой DEBUG=True в .env
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# Хосты, с которых Django принимает запросы.
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS',
                               'localhost,127.0.0.1').split(',')

# Адреса фронтенда, которым браузер разрешает обращаться к API
# (иначе он блокирует запросы с другого порта, см. CORS).
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://127.0.0.1:5173',
).split(',')


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'django_filters',
    'organizations',
    'accounts',
    'favorites',
    'corsheaders',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'vdzh.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'vdzh.wsgi.application'


# Параметры БД берутся из окружения.
# По умолчанию 127.0.0.1, а не localhost:
# на Windows localhost подвисал из-за IPv6.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'vdzh'),
        'USER': os.environ.get('POSTGRES_USER', 'vdzh'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('POSTGRES_HOST', '127.0.0.1'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}

# JWT как единственный способ аутентификации:
# клиент передает токен в заголовке 'Authorization: Bearer <access>'.
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# Access-токен живет 30 минут, чтобы украденный быстро устарел.
# Refresh-токен живет дольше (7 дней), чтобы не входить заново каждый раз.
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Своя модель пользователя (добавлено поле phone).
# Подменять её нужно до первой миграции, иначе базу приходится пересоздавать.
AUTH_USER_MODEL = 'accounts.User'

LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_TZ = True


STATIC_URL = 'static/'
