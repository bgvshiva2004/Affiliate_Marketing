from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class ProductLinksSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProductLinks                                                        
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User 
        fields = ['id','username','password']

class UserListsSerializer(serializers.ModelSerializer):
    ...
    class Meta(object):
        model = UserLists
        fields = "__all__"