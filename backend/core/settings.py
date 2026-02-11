import dj_database_url
from pathlib import Path
import os
from datetime import timedelta
from dotenv import load_dotenv
import cloudinary

# 1. Rutas Base
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. Cargar variables de entorno
load_dotenv(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-fallback-key')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    "mi-ecommerce-pro-production.up.railway.app",
    "localhost",
    "127.0.0.1"
]

# 3. Aplicaciones (Orden crítico para estáticos)
INSTALLED_APPS = [
    'whitenoise.runserver_nostatic', # Prioridad para servir CSS
    'cloudinary_storage',            # Manejo de Media
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cloudinary',
    'rest_framework',
    'corsheaders',
    'users',
    'products',
    'orders.apps.OrdersConfig',
]

# 4. Middleware (WhiteNoise debe ir justo después de Security)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

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

WSGI_APPLICATION = 'core.wsgi.application'

# 5. Base de Datos
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}

# 6. Internacionalización
LANGUAGE_CODE = 'es-mx'
TIME_ZONE = 'America/Mexico_City'
USE_I18N = True
USE_TZ = True

# --- 7. ARCHIVOS ESTÁTICOS Y MEDIA (BLINDADO PARA RAILWAY) ---

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Forzamos la búsqueda en la carpeta local 'static'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Buscadores de archivos: Necesarios para que collectstatic vea el Admin
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Configuración unificada para Django 6
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.StaticFilesStorage",
    },
}

# Compatibilidad con librerías externas
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
STATICFILES_STORAGE = 'whitenoise.storage.StaticFilesStorage'

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}

# Evitamos que Cloudinary interfiera con el CSS de WhiteNoise
CLOUDINARY_STORAGE['STATICFILES_STORAGE'] = None

# --- 8. Otras configuraciones ---

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}

AUTH_USER_MODEL = "users.User"
CSRF_TRUSTED_ORIGINS = ["https://mi-ecommerce-pro-production.up.railway.app"]
CORS_ALLOW_ALL_ORIGINS = True 

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')