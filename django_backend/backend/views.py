from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from . serializer import *
# Create your views here.

class ReactView(APIView):
    def get(self, request):
        output = [{'card_title': output.card_title,"card_desc": output.card_desc, "card_git_link": output.card_git_link} for output in React.objects.all()]
        return Response(output)
    
    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception = True):
            serializer.save()
            return Response(serializer.data)