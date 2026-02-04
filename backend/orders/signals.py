from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, OrderItem

@receiver(post_save, sender=Order)
def reduce_stock_on_payment(sender, instance, **kwargs):
    # 1. Solo actuamos si la orden está pagada y NO hemos reducido el stock antes
    if instance.paid and not instance.stock_reduced:
        items = instance.items.all()
        
        Order.objects.filter(pk=instance.pk).update(stock_reduced=True)
        # Si la orden se acaba de crear en el Admin, items estará vacío temporalmente.
        # Por eso es mejor que 'paid' empiece en False y lo cambies después.
        if items.exists():
            print(f"--- Procesando Stock para Orden #{instance.id} ---")
            for item in items:
                product = item.product
                product.stock -= item.quantity
                product.save()
                print(f"Reducido: {product.name}. Nuevo stock: {product.stock}")
            
            # 2. Marcamos que ya redujimos el stock para no repetirlo
            # Usamos .update() para evitar que se dispare este mismo signal otra vez
            Order.objects.filter(id=instance.id).update(stock_reduced=True)
        else:
            print("Se detectó pago pero la orden aún no tiene productos vinculados.")