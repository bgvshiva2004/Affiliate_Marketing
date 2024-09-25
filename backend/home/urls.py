from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
    path('',views.index,name="index"),
    path('product_links_api/', views.ProductLinksAPI.as_view()),
]