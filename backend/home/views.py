from django.contrib.auth.models import User
from rest_framework import status , viewsets
from rest_framework.generics import ListAPIView , ListCreateAPIView , RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view , action
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import *
from .serializers import * 
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework_simplejwt.views import TokenRefreshView
from datetime import datetime
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import CustomTokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

from rest_framework.views import APIView


# Create your views here.
class ProductLinksAPI(ListAPIView):
    serializer_class = ProductLinksSerializers
    authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    def get_queryset(self):
        print(self.request.user)
        queryset = ProductLinks.objects.all()

        search_query = self.request.query_params.get('q' , None)
        if search_query:
            queryset = queryset.filter(
                Q(product_name__icontains=search_query) |
                Q(product_description__icontains=search_query)
            )
            return queryset
        
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

class UserListsAPI(ListCreateAPIView , RetrieveUpdateDestroyAPIView):
    queryset = UserLists.objects.all()
    serializer_class = UserListsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserLists.objects.filter(user = self.request.user)

    def perform_create(self , serializer):
        user = self.request.user
        print("hello")
        print(user)
        serializer.save(user = user)

    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


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



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CustomTokenRefreshSerializer


class UserDetails(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        return Response({
            'username' : user.username
        })
    

