from pyrsistent import field
from rest_framework import serializers
from .models import Cake, Cart, CartItem


class CakeSerializer(serializers.ModelSerializer):
    # Add fields validators

    class Meta:
        model = Cake
        fields = ('pk', 'image', 'name', 'price', 'description')


class CartItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartItem
        fields = ('pk', 'cart', 'item', 'quantity')


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cart
        fields = ('total', 'task_id')
