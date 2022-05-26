from django.db import models

# Create your models here.


# Users
# Корзина
# Заказ: Celery task

class Cake(models.Model):
    image = models.CharField('image', max_length=255)
    name = models.CharField('name', max_length=255)
    price = models.PositiveSmallIntegerField('price')
    description = models.TextField('descriptions')
    creation_date = models.DateField('creation_date', auto_now=True)

    def __str__(self) -> str:
        return self.name


class CartItem(models.Model):
    cart = models.ForeignKey(
        'cart', null=True, blank=True, on_delete=models.CASCADE)
    item = models.ForeignKey(Cake, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)


class Cart(models.Model):
    total = models.DecimalField(max_digits=100, decimal_places=2, default=0.00)
