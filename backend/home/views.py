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
from .agent import get_products_from_list
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.tokens import RefreshToken


from django.db.models import Q

class ProductLinksAPI(ListAPIView):
    serializer_class = ProductLinksSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        print(self.request.user)
        queryset = ProductLinks.objects.all()

        # Get search parameters
        search_query = self.request.query_params.get('q', None)
        product_id = self.request.query_params.get('id', None)
        product_name = self.request.query_params.get('product_name', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        # Use GroqAgent to expand search terms if search_query exists
        if search_query:
            # Get expanded search terms from GroqAgent
            expanded_terms = get_products_from_list(
                title=search_query,
                description=search_query,
                hobbies=None,
                age=None
            )
            
            # Create a combined Q object for all search terms
            query_filter = Q()
            
            # Add original search terms
            for word in search_query.split():
                query_filter |= (
                    Q(product_name__icontains=word) |
                    Q(product_description__icontains=word)
                )
            
            # Add expanded search terms
            for term in expanded_terms:
                query_filter |= (
                    Q(product_name__icontains=term) |
                    Q(product_description__icontains=term)
                )
            
            queryset = queryset.filter(query_filter)

        # Filter by product ID
        if product_id:
            queryset = queryset.filter(id=product_id)

        # Filter by product name
        if product_name:
            queryset = queryset.filter(product_name__icontains=product_name)

        # Filter by price range
        if min_price or max_price:
            price_filters = Q()
            if min_price:
                price_filters &= Q(product_price__gte=min_price)
            if max_price:
                price_filters &= Q(product_price__lte=max_price)
            queryset = queryset.filter(price_filters)

        # Handle recommended products for authenticated users
        if self.request.user.is_authenticated:
            try:
                user_profile = UserProfile.objects.get(user=self.request.user)
                recommended_products = user_profile.recommended_products.all()
                recommended_ids = recommended_products.values_list('id', flat=True)
                non_recommended_products = queryset.exclude(id__in=recommended_ids)
                
                # Combine recommended and non-recommended products
                final_queryset = (
                    recommended_products.distinct() | non_recommended_products.distinct()
                )
                return final_queryset

            except UserProfile.DoesNotExist:
                print("User profile not found, returning all products.")

        return queryset.distinct()



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


class SignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data['password'])
            user.save()

            # Update UserProfile
            user.userprofile.hobbies = request.data.get('hobbies', None)
            user.userprofile.age = request.data.get('age', None)
            user.userprofile.save()

            refresh = RefreshToken.for_user(user)

            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": serializer.data,
                "profile": {
                    "hobbies": request.data.get('hobbies'),
                    "age": request.data.get('age')
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user = get_object_or_404(User, username=request.data['username'])
        
        if not user.check_password(request.data['password']):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(instance=user)
        
        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": serializer.data
        })



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
        # print(self.request.user)
        return Response({
            'username' : user.username
        })
        

# if the user is not logged in then display all the products 
    
# if logged in if old list is already there and a new list is been added then filter out the products from the list elements and then add the products as recommended products for the user, if the user did not add any list then display all products , if recommended products are present then display them at the top else display all the products in any order
    
# once i get the list items , use groq api call and make the items list in an array , then search the items from the db , do partial searching and once thats do then add the recommended products list with the products , recommended products list is a many to many field to products , 
    
# the above algorithm must run when a new product gets added then again groq api call will make it into an array of products and then it will be partial searched in db and then those will get added
    
# update the get products api call and display the check if there are any recommended products present , if present display them at the top and display all other unique products at the bottom, if there are no recommended products then display all the products , if the user is not logged in display all the products
        

    

