from django.http import JsonResponse
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication 
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
import json
from django.contrib.auth import logout
from .services import register_proveedor


# -------------------------Vista de Login------------------------------------
@csrf_exempt
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Asegúrate de recibir el cuerpo de la solicitud como JSON
            username = data.get('username')
            password = data.get('password')

            if username is None or password is None:
                return JsonResponse({'error': 'Username and password are required'}, status=400)

            user = authenticate(request, username=username, password=password)
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)

                login(request, user)
                return JsonResponse({
                    'token': token.key,
                    'user': {
                        'rol': user.rol
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt  # Solo temporalmente para pruebas, no en producción
@permission_classes([AllowAny])
def logout_view(request):
    if request.method == 'POST':
        try:
            # Obtiene el token de la cabecera de la solicitud
            token = request.META.get('HTTP_AUTHORIZATION').split()[1]  # Expectativa de que sea un token de tipo 'Token <token>'
            token_instance = Token.objects.get(key=token)
            token_instance.delete()  # Elimina el token de la base de datos

            logout(request)  # Cierra la sesión del usuario
            return JsonResponse({'message': 'Logged out successfully'})
        except (Token.DoesNotExist, IndexError):
            return JsonResponse({'error': 'Invalid token'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_proveedor_view(request):
    if request.method == 'POST':
        data = request.data
        user, proveedor = register_proveedor(data)
        return Response({'message': 'Proveedor registrado exitosamente', 'user': str(user)}, status=status.HTTP_201_CREATED)
    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)