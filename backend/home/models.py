from django.db import models

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
    listAuthor = models.CharField(max_length=75000)
    listTitle = models.CharField(max_length=200 , blank = True , null = True)
    listContent = models.TextField()