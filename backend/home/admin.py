from django.contrib import admin
from .models import ProductLinks

# Register your models here.

class ProductLinksAdmin(admin.ModelAdmin):
    list_display = ('product_name' , 'product_link' , 'product_platform')

admin.site.register(ProductLinks,ProductLinksAdmin)