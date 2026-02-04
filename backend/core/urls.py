from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from orders.views import create_payment_intent

urlpatterns = [
    path('admin/', admin.site.urls),
    #Productos y categorías
    path('api/', include('products.urls')),
    #órdenes
    path('api/', include('orders.urls')),
    #Pago
    path('api/create-payment-intent/', create_payment_intent, name='create-payment-intent'),

    #Endpoint para loguearse(Obtener token)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #Endpoint para renovar el token cuando expire
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #Documentacion de la api
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),#esquema openapi
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger_ui'),#swagger visual

    #Registrar usuario
    path('api/', include('users.urls')),
]

#Solo en desarrollo: permite ver las imágenes subidas
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
