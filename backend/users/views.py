from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model

# Create your views here.
User= get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    #Permitimos que cualquier persona pueda registrarse
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)