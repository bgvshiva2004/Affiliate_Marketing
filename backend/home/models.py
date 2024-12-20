from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ProductLinks(models.Model):
    product_name = models.CharField(max_length=100)
    product_link = models.URLField()
    product_platform = models.CharField(max_length=100)
    # product_image = models.ImageField()
    product_price = models.CharField(max_length=50 ,default='100')

    def __str__(self):
        return self.product_name


class UserLists(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_lists')
    title = models.CharField(max_length=200 , blank = True , null = True)
    description = models.TextField(blank = True,null = True)

    def __str__(self):
        return self.title or "Untitled List"