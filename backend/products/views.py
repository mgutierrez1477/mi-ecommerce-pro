from rest_framework import viewsets, permissions
from .models import Product, Category
from .serializers import CategorySerializer, ProductSerializer

class CategoryViewset(viewsets.ReadOnlyModelViewSet):
    #Vistaset para categorías: solo lectura
    #cualquier usuario puede ves las categorías

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    lookup_field = 'slug'

class ProductViewset(viewsets.ReadOnlyModelViewSet):
    #Vistaset para productos: solo lectura
    
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    #Buscaremos por slug en ves de por id
    lookup_field = 'slug'


