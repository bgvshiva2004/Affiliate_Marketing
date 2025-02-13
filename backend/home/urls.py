from django.contrib import admin
from django.urls import path,re_path
from . import views
from .views import CustomTokenObtainPairView,CustomTokenRefreshView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

urlpatterns = [
    path('products/', views.ProductLinksAPI.as_view()),
    path('lists/' , UserListsAPI.as_view(),name='user-lists'),
    path('lists/<int:pk>/' , UserListsAPI.as_view(),name='user-list-detail'),
    path('userDetails/',views.UserDetails.as_view()),
    re_path('signup',SignupView.as_view()),
    re_path('login',LoginView.as_view()),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]