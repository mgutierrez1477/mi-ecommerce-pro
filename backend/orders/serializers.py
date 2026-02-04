from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    # Esto permite ver los items detallados dentro de la orden
    items = OrderItemSerializer(many=True)
    total_cost = serializers.ReadOnlyField(source='get_total_cost')
    customer_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'items', 'total_cost', 'paid', 'address', 'city', 'postal_code', 'created_at']

    def create(self, validated_data):
        # 3. Usamos .pop con un valor por defecto [] para evitar el KeyError
        items_data = validated_data.pop('items', [])
        
        # Creamos la orden (el usuario viene del view.perform_create)
        order = Order.objects.create(**validated_data)
        
        # 4. Creamos cada item asociado a la orden
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            
        return order
