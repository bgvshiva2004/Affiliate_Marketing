from django.shortcuts import render,HttpResponse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.generics import ListAPIView , ListCreateAPIView
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import *
from .serializers import * 
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework_simplejwt.views import TokenRefreshView
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import CustomTokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


# Create your views here.
class ProductLinksAPI(ListAPIView):
    serializer_class = ProductLinksSerializers

    def get_queryset(self):
        queryset = ProductLinks.objects.all()
        product_id = self.request.query_params.get('id', None)
        product_name = self.request.query_params.get('product_name', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if product_id:
            queryset = queryset.filter(id=product_id)

        if product_name:
            queryset = queryset.filter(product_name__icontains=product_name)

        if min_price or max_price:
            price_filters = Q()
            if min_price:
                price_filters &= Q(product_price__gte=min_price)
            if max_price:
                price_filters &= Q(product_price__lte=max_price)
            queryset = queryset.filter(price_filters)

        return queryset

class UserListsAPI(ListCreateAPIView):
    queryset = UserLists.objects.all()
    serializer_class = UserListsSerializer

    def perform_create(self , serializer):
        serializer.save()


@api_view(['POST'])
def signup(request):

    serializer = UserSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        
        user = User.objects.get(username = request.data['username'])
        user.set_password(request.data['password'])
        user.save()

        token = Token.objects.create(user = user)

        return Response({"token" : token.key , "user" : serializer.data})
    
    return Response(serializer.errors , status = status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):

    user = get_object_or_404(User , username = request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({"detail" : "Not_Found"} , status = status.HTTP_404_NOT_FOUND)
    
    token , created = Token.objects.get_or_create(user = user)
    serializer = UserSerializer(instance = user)

    return Response({"token" : token.key , "user" : serializer.data})

def index(request):
    return HttpResponse("Index page")
        


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class CustomTokenRefreshView(TokenRefreshView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CustomTokenRefreshSerializer