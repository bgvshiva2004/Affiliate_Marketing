from django.db import models

# Create your models here.

class ProductLinks(models.Model):
    product_name = models.CharField(max_length=100)
    product_link = models.URLField()
    product_platform = models.CharField(max_length=100)
    # product_image = models.ImageField()

    def __str__(self):
        return self.product_name