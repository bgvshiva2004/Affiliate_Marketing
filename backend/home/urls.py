from django.contrib import admin
from django.urls import path,re_path
from . import views

urlpatterns = [
    path('',views.index,name="index"),
    path('product_links_api/', views.ProductLinksAPI.as_view()),
    re_path('signup',views.signup),
    re_path('login',views.login),
]