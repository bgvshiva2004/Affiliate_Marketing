from django.contrib import admin
from django.urls import path,re_path
from . import views
from .views import CustomTokenObtainPairView,CustomTokenRefreshView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('',views.index,name="index"),
    path('products/', views.ProductLinksAPI.as_view()),
    path('notes/' , views.UserListsAPI.as_view()),
    re_path('signup',views.signup),
    re_path('login',views.login),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    
]