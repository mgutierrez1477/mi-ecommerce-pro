from django.db import models
from django.conf import settings
from products.models import Product

# Create your models here.
class Order(models.Model):
    #Relacionamos la orden con el usuario, si el usuario se borra
    #protegemos la orden para no perder historial contable
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='orders')
    created_at = models.DateField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    paid = models.BooleanField(default=False)#Se activará cuando stripe confirme el pago
    stock_reduced = models.BooleanField(default=False)

    #Información de envío (Snapshot de dondé vivía el usuario al comprar)
    address = models.CharField(max_length=250)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Order {self.id}'
    
    def get_total_cost(self):
        #Sumamos el costo de todos los items asociados a esta orden
        return sum(item.get_cost() for item in self.items.all())
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    # Aquí guardaremos el precio al momento de la compra(Snapshot)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return str(self.id)
    
    def get_cost(self):
        return self.price * self.quantity