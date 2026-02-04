from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewset, CategoryViewset

#El router genera automáticamente URLS como:
#/api/products/ (lista)
#/api/products/slug-del-producto/ (detalle)
router = DefaultRouter()
router.register(r'products', ProductViewset)
router.register(r'categories', CategoryViewset)

urlpatterns = [
    path('', include(router.urls)),
    # Ejemplo de lo que deberías tener en el backend
]
