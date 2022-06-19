# Create your views here.

from unittest import result
from PieStore.tasks import make_order
from celery.result import AsyncResult
from PieStore.celery import app

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view
from rest_framework import status
import logging

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Cake, Cart, CartItem
from .serializers import CakeSerializer, CartItemSerializer, CartSerializer

logger = logging.getLogger(__name__)


# @celery_app.task()
# def add(a, b):
#     return a + b


@api_view(['GET', 'POST'])
def cakes_list(request: Request):
    if request.method == 'GET':
        cakes = Cake.objects.all()

        serializer = CakeSerializer(
            cakes, context={'request': request}, many=True)

        # logger.debug(f"cakes_list_get: {serializer.data}")
        # task = add.delay(1, 2)

        # task = make_order.delay(5)
        # task = make_order.s(5).apply_async(task_id="Hello")

        # task = make_order.delay(5)
        # logger.warning(type(task.id))
        # while not task.ready():
        #     sleep(secs := 0.5)
        #     logger.warning(f'{task.state}, {task.info} {task.id}')

        # print(task.state, task.result)

        return Response({'data': serializer.data})

    if request.method == 'POST':
        serializer = CakeSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def cakes_detail(request: Request, pk):
    try:
        cake = Cake.objects.get(pk=pk)
    except Cake.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CakeSerializer(
            cake, context={'request': request}
        )
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = CakeSerializer(
            cake, data=request.data, context={'request': request})
        if serializer.is_valid():
            return Response(serializer.data)
        logger.warning('Warning: bad request')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        cake.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def cart_id(request):
    if request.method == 'GET':
        cart_id = request.session.get('cart_id')

        if cart_id == None:
            cart = Cart()
            cart.save()
            cart_id = cart.id
            request.session["cart_id"] = cart_id

        return Response(cart_id)


@api_view(['GET', 'POST', 'DELETE'])
def cart_detail(request: Request, cart_id):

    try:
        cart = Cart.objects.get(id=cart_id)
    except Cart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        try:
            cake = Cake.objects.get(pk=request.data["item"])
        except Cake.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            created = False
            item = CartItem.objects.filter(cart=cart, item=cake).get()
        except CartItem.DoesNotExist:
            created = True
            item = CartItem(cart=cart, item=cake)

        item.quantity = request.data.get("quantity", 0)

        data = request.data

        if item.quantity != 0:
            item.save()
            data["total_price"] = cake.price * data["quantity"]
        elif not created:
            item.delete()

        return Response(data, status=status.HTTP_201_CREATED)

    try:
        items = CartItem.objects.filter(
            cart=cart).all()
    except CartItem.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CartItemSerializer(
            items, context={'request': request}, many=True
        )
        for item in serializer.data:
            item.pop("cart", None)
            item["total_price"] = Cake.objects.get(
                pk=item["item"]).price * item["quantity"]

        task_id = cart.task_id

        task_status = 'CHOOSING'
        timer = None
        if not task_id is None:
            result = AsyncResult(task_id, app=app)
            task_status = result.status
            timer = result.info
            if timer == 0.0:
                cart.task_id = None
                cart.save()

        return Response({'data': serializer.data, 'status': task_status, 'timer': timer})

    if request.method == 'DELETE':
        serializer = CartItemSerializer(
            items, context={'request': request}, many=True
        )
        for item in serializer.data:
            item.pop("cart", None)
            item["total_price"] = Cake.objects.get(
                pk=item["item"]).price * item["quantity"]
        logger.warning(f'New order with id={cart_id} data: {serializer.data}')
        task = make_order.delay(10)
        cart.task_id = task.id
        cart.save()

        items.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
