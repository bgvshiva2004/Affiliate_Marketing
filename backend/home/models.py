# models.py

from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver
from .agent import get_products_from_list

class ProductLinks(models.Model):
    product_name = models.CharField(max_length=100)
    product_link = models.URLField()
    product_platform = models.CharField(max_length=100)
    product_image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    product_price = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    product_description = models.TextField(blank=True)
    product_country = models.CharField(max_length=100, default='India')
    product_category = models.CharField(max_length=100, default='none')

    def __str__(self):
        return self.product_name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    recommended_products = models.ManyToManyField(ProductLinks, related_name='recommended_to_users', blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def add_recommendations(self, products):
        """Add new recommendations while keeping existing ones"""
        self.recommended_products.add(*products)

class UserLists(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_lists')
    title = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    hobbies = models.TextField(blank=True, null=True)  # Field for hobbies
    age = models.IntegerField(blank=True, null=True)  # Field for age

    def __str__(self):
        return self.title or "Untitled List"
    
    def update_recommendations(self):
        """Update user's recommended products based on list content, hobbies, and age."""
        try:
            # Extract product terms from title and description
            product_terms = get_products_from_list(self.title, self.description)

            # Extract hobby-related terms
            hobby_terms = []
            if self.hobbies:
                hobby_terms = get_products_from_list(self.hobbies, None)

            # Combine all terms (title/description + hobbies)
            all_terms = set(product_terms + hobby_terms)

            if not all_terms:
                return

            query = Q()
            for term in all_terms:
                if term:
                    query |= (
                        Q(product_name__icontains=term) |
                        Q(product_description__icontains=term)
                    )

            # Filter products based on the query
            if query != Q():
                matching_products = ProductLinks.objects.filter(query).distinct()

                # Adjust recommendations based on age (if available)
                if self.age:
                    matching_products = matching_products.filter(
                        Q(age_min__lte=self.age) | Q(age_max__gte=self.age)
                    )

                # Update user profile with recommendations
                user_profile, _ = UserProfile.objects.get_or_create(user=self.user)
                user_profile.add_recommendations(matching_products)

        except Exception as e:
            print(f"Error updating recommendations: {str(e)}")


@receiver(post_save, sender=UserLists)
def update_recommendations_on_list_save(sender, instance, created, **kwargs):
    instance.update_recommendations()