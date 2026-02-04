from rest_framework import serializers
from . models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    #Mostramos la categoría como un objeto anidado
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'name', 'slug',
            'description', 'price', 'stock', 'image', 'created_at'
        ]