from rest_framework import serializers
from .models import *

class ProductLinksSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProductLinks                                                        
        fields = "__all__"
