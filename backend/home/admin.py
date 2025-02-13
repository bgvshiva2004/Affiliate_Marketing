from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, UserLists, ProductLinks

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_age', 'is_staff')

    def get_age(self, obj):
        return obj.userprofile.age if hasattr(obj, 'userprofile') else None
    get_age.short_description = 'Age'

class ProductLinksAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'product_platform', 'product_price', 'product_country', 'product_category')
    search_fields = ('product_name', 'product_description', 'product_category')
    list_filter = ('product_platform', 'product_country', 'product_category')

class UserListsAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'description')
    search_fields = ('title', 'description', 'user__username')

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(ProductLinks, ProductLinksAdmin)
admin.site.register(UserLists, UserListsAdmin)

admin.site.register(UserProfile)