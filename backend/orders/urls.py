from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, stripe_webhook

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    # Esta es la ruta que usaremos para Stripe
    path('orders/webhook/', stripe_webhook, name='stripe-webhook'),

    # Las rutas automáticas del router (GET /api/orders/, POST /api/orders/, etc.)
    path('', include(router.urls)),
]