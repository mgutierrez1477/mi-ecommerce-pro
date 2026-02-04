from django.contrib import admin
from .models import Order, OrderItem

# Register your models here.
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product'] #Útil si tienes miles de producto, abre una ventanita búsqueda
    extra = 0 #Evita que salgan filas vacias por defecto

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','user', 'paid', 'created_at', 'update_at']
    list_filter = ['paid', 'created_at', 'update_at']
    # Para buscar por usuario en un ForeignKey, usamos 'user__email' o 'user__username'
    search_fields = ['user__email', 'address']
    #Insertamos los items dentro de la orden
    inlines = [OrderItemInline]

