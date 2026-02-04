from django.contrib import admin
from .models import Product, Category

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    #mostramos los campos en la lista admin
    list_display = ['name', 'slug']
    #Hace que el slug se escriba solo mientras escribes
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock', 'category', 'created_at']
    list_filter = ['category', 'created_at'] #Filtros laterales
    list_editable = ['price', 'stock'] #permite editar stock y precios
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description'] #Barra de busqueda
    
