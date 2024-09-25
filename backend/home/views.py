from django.shortcuts import render,HttpResponse
from rest_framework.generics import ListAPIView
from .models import *
from .serializers import *

# Create your views here.

class ProductLinksAPI(ListAPIView):
    queryset = ProductLinks.objects.all()
    serializer_class = ProductLinksSerializers



def index(request):
    return HttpResponse("Index page")