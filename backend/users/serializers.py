from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'username', 'is_staff', 'is_superuser','phone', 'address')

class RegisterSerializer(serializers.ModelSerializer):
    #aplicar validaciones
    password = serializers.CharField(
        write_only = True,
        required = True,
        validators = [validate_password]
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'phone', 'address',)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado")
        return value

    def create(self, validated_data):
        #usamos create_user en lugar de create para que django
        #se encarge de hashear la contraseña automáticamente
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', '')
        )
    
        return user