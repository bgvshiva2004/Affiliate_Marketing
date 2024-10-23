from django.contrib import admin
from .models import *

# Register your models here.

class ProductLinksAdmin(admin.ModelAdmin):
    list_display = ('product_name' , 'product_link' , 'product_platform')

admin.site.register(ProductLinks,ProductLinksAdmin)


class UserListsAdmin(admin.ModelAdmin):
    list_display = ('listAuthor' , 'listTitle' , 'listContent')

admin.site.register(UserLists , UserListsAdmin)