from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ProductLinks(models.Model):
    product_name = models.CharField(max_length=100)
    product_link = models.URLField()
    product_platform = models.CharField(max_length=100)
    product_image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    product_price = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    product_description = models.TextField(blank=True)
    product_country = models.CharField(max_length=100, default='India')
    product_category = models.CharField(max_length=100, default='none')
    # product_niche = models.CharField(max_length=100)

    def __str__(self):
        return self.product_name


class UserLists(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_lists')
    title = models.CharField(max_length=200 , blank = True , null = True)
    description = models.TextField(blank = True,null = True)

    def __str__(self):
        return self.title or "Untitled List"