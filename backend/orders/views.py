import stripe
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import viewsets, permissions, filters
from .models import Order, Product
from .serializers import OrderSerializer
from rest_framework.exceptions import ValidationError
from django.http import HttpResponse
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination

stripe.api_key = settings.STRIPE_SECRET_KEY

#Solo acepta solicitudes post
@api_view(['POST'])
#request contiene datos del cliente, headers, etc
def create_payment_intent(request):

    #Obtenemos el id de la orden que envía el frontend
    order_id = request.data.get('order_id')

    try:
        #Buscamos la orden en nuestra db
        order = Order.objects.get(id=order_id, user=request.user)

        #Calculamos el total en centavos (stripe 10.50 -> 1050)
        #Multiplicamos por 100 y convertimos a enteros
        amount = int(order.get_total_cost() * 100)

        #Creamos el intento en el metadata
        intent = stripe.PaymentIntent.create(
            amount= amount,#monto   
            currency='usd',#moneda
            automatic_payment_methods={'enabled':True},#genera automaticamente los metodos de pago disponibles
            metadata={'order_id':order.id} #Vinculamos el pago con la DB
        )
        return Response({'clientSecret': intent['client_secret']}) #Pago exitoso, respuesta al front
    
    #MAJENO DE ERRORES
    except Order.DoesNotExist:#Orden inexistente
        return Response({'error': 'Orden no encontrada'}, status=404)
    except Exception as e: #error generico
        return Response ({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    """
    Webhook que recibe eventos directamente desde Stripe.
    Stripe llamará a este endpoint automáticamente cuando ocurra
    un evento (pago exitoso, fallido, cancelado, etc.).
    """

    #cuerpo crudo de la informacion de stripe
    payload = request.body
    #Firma
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    event = None

    try:
        #Validamos el evento
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET #Clave secreta
        )
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
    #pago exitoso
    if event['type'] == 'payment_intent.succeeded':
            intent = event['data']['object']
            order_id = intent.metadata.get('order_id')
            
            try:
                order = Order.objects.get(id=order_id)
                # Al poner paid=True y hacer .save(), se dispara automáticamente 
                # tu Signal que reduce el stock. ¡Magia!
                order.paid = True 
                order.save() 
            except Order.DoesNotExist:
                return HttpResponse(status=404)

    return HttpResponse(status=200)

#Paginacion de ordenes
class SmallSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

    

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = SmallSetPagination

    # Filtros de busqueda
    filter_backends = [filters.SearchFilter]
    # Aquí defines por qué campos quieres buscar:
    # 'id' para el número de orden
    # 'user__username' para el nombre del cliente (relación con User)
    search_fields = ['id', 'user__username']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        items_data = self.request.data.get('items', [])

        # Validación de stock 
        for item in items_data:
            product = Product.objects.get(id=item['product'])
            if product.stock < item['quantity']:
                raise ValidationError(
                    f"Lo sentimos, solo quedan {product.stock} unidades de {product.name}"
                )

        serializer.save(user=self.request.user)

    #  ESTADÍSTICAS 
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def stats(self, request):
        orders = Order.objects.filter(paid=True).prefetch_related('items')

        
        total_revenue = sum(order.get_total_cost() for order in orders)

        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(paid=False).count()

        low_stock_products = Product.objects.filter(stock__lt=5).values('name', 'stock')

        return Response({
            "total_revenue": float(total_revenue),
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "low_stock_count": low_stock_products.count(),
            "low_stock_list": list(low_stock_products),
        })

