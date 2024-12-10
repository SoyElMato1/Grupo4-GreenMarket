from django.http import JsonResponse
from django.conf import settings
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
from django.core.mail import send_mail
import uuid


# -------------------------Vista de Login------------------------------------
@csrf_exempt
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Asegúrate de recibir el cuerpo de la solicitud como JSON
            username = data.get('username')
            password = data.get('password')

            # Validación de campos requeridos
            if username is None or password is None:
                return JsonResponse({'error': 'Username and password are required'}, status=400)

            # Autenticación del usuario
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Generar o recuperar el token
                token, _ = Token.objects.get_or_create(user=user)
                login(request, user)

                # Generar y enviar código de autenticación en dos pasos (2FA)
                two_factor, _ = TwoFactor.objects.get_or_create(user=user)
                two_factor.generate_code()

                if user.correo_user:
                    try:
                        send_mail(
                            'Tu código de verificación',
                            f'Tu código es: {two_factor.code}',
                            settings.DEFAULT_FROM_EMAIL,
                            [user.correo_user],
                            fail_silently=False,
                            html_message=f'''
                                <html>
                                    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
                                        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; padding: 20px;">
                                            <h2 style="color: #0056b3; text-align: center;">Verificación de tu Cuenta</h2>
                                            <p style="font-size: 16px; line-height: 1.6;">Hola { user.nom_user },</p>
                                            <p style="font-size: 16px; line-height: 1.6;">
                                                Utiliza el siguiente código de verificación:
                                            </p>
                                            <p style="font-size: 24px; font-weight: bold; color: #007bff; text-align: center; padding: 10px 0; letter-spacing: 2px;">
                                                { two_factor.code }
                                            </p>
                                        </div>
                                        <footer style="text-align: center; padding: 20px 0; background-color: #28a745; color: #fff; border-radius: 10px; margin-top: 40px;">
                                            <p style="font-size: 14px;">&copy; 2024 GreenMarket. Todos los derechos reservados.</p>
                                        </footer>
                                    </body>
                                </html>''',
                        )
                    except Exception as e:
                        return JsonResponse({'error': f'Failed to send email: {str(e)}'}, status=500)
                else:
                    return JsonResponse({'error': 'User does not have a valid email address'}, status=400)

                # Respuesta indicando que se requiere 2FA
                return JsonResponse({
                    'message': '2FA code sent to your email. Please verify.',
                    'requires_2fa': 'True',
                    'user': {
                        'username': user.username,
                        'rol': user.rol
                    }
                })

            # Credenciales inválidas
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

        except json.JSONDecodeError:
            # Manejo de errores en el formato JSON
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    # Método HTTP no permitido
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

# ------------------------- Verificacion doble factor ------------------------------
@csrf_exempt
@permission_classes([AllowAny])
def verify_2fa_code(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            code = data.get("code")
            if not username or not code:
                return JsonResponse(
                    {"error": "usuario y codigo requerido"}, status=400
                )
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return JsonResponse({"error": "usuario no existe"}, status=404)
            try:
                two_factor = TwoFactor.objects.get(user=user)
                if two_factor.code == code:
                    login(request, user)
                    token, _ = Token.objects.get_or_create(user=user)
                    return JsonResponse(
                        {
                            "message": "Verificación exitosa",
                            "token": token.key,
                            "user": {
                                "username": user.username,
                                "rol": user.rol,
                            },
                        }
                    )
                else:
                    return JsonResponse(
                        {"error": "codigo expirado o invalido"}, status=400
                    )
            except TwoFactor.DoesNotExist:
                return JsonResponse(
                    {"error": "no se pudo generar el codigo"}, status=404
                )
        except json.JSONDecodeError:
            return JsonResponse({"error": "json invalido"}, status=400)
    return JsonResponse({"error": "metodo invalido"}, status=405)

# ---------------------------------------RECUPERAR CONTRASEÑA-------------------------------------------------------
@csrf_exempt
@permission_classes([AllowAny])
def request_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            try:
                user = User.objects.get(correo_user=email)
                token = str(uuid.uuid4())
                send_mail(
                    'Recuperación de contraseña',
                    f'Usa este token para recuperar contraseña: {token}',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                    html_message=f'''
                        <html>
                            <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
                                <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; padding: 20px;">
                                    <h2 style="color: #0056b3; text-align: center;">Petición de recuperación de contraseña</h2>
                                    <p style="font-size: 16px; line-height: 1.6;">Hola { user.nom_user }</p>
                                    <p style="font-size: 16px; line-height: 1.6;">
                                        Para recuperar tu contraseña, haz clic en el siguiente botón:
                                    </p>
                                    <p style="text-align: center; margin-bottom: 30px;">
                                        <a href="http://localhost:8100/recuperar?token={token}" 
                                            style="background-color: #007bff; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                            Recuperar Contraseña
                                        </a>
                                    </p>
                                    <p style="font-size: 14px; line-height: 1.6; color: #777; text-align: center;">
                                        Si no solicitaste esta recuperación, por favor ignora este mensaje.
                                    </p>
                                </div>
                                <footer style="text-align: center; padding: 20px 0; background-color: #28a745; color: #fff; border-radius: 10px; margin-top: 40px;">
                                    <p style="font-size: 14px;">&copy; 2024 GreenMarket. Todos los derechos reservados.</p>
                                </footer>
                            </body>
                        </html>
                        ''',
                )
                PasswordReset.objects.get_or_create(usuario = user, token = token)
                return JsonResponse({'message': 'Reseteo de contraseña enviado'}, status=200)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Usuario con este correo no existe'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Json invalido'}, status=400)
    return JsonResponse({'error': 'Metodo invalido'}, status=405)
@csrf_exempt
@permission_classes([AllowAny])
def reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')
            new_password = data.get('new_password')
            try:
                reset_token = PasswordReset.objects.get(token=token)
                if not reset_token.is_valid():
                    return JsonResponse({'error': 'Token expirado'}, status=400)
                user = reset_token.usuario
                user.set_password(new_password)
                user.save()
                reset_token.delete()
                return JsonResponse({'message': 'contraseña cambiada'}, status=200)
            except PasswordReset.DoesNotExist:
                return JsonResponse({'error': 'invalido'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON invalido'}, status=400)
    return JsonResponse({'error': 'Metodo invalido'}, status=405)