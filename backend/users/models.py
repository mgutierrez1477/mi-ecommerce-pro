from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    #Hacemos que el email sea único y obligatorio para el login
    email = models.EmailField(unique=True, blank=False, null=False)

    #Campos extra
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    #Establecemos el email como campo para iniciar sesión
    USERNAME_FIELD = 'email'
    #Django tambien pedira username cuando creemos el super usuario
    REQUIRED_FIELDS = ['username']

    EMAIL_FIELD = ['email']

    def __str__(self):
        return self.email
