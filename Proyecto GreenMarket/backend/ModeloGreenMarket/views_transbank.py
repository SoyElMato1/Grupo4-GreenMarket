from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
import json
from django.http import HttpResponse, JsonResponse
from transbank.webpay.webpay_plus.transaction import Transaction, WebpayOptions
from transbank.common.integration_type import IntegrationType
from django.shortcuts import get_object_or_404, redirect, render

#------------------------Vista Transbank---------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def iniciar_pago(request):
    try:
        # Obtener el cuerpo de la solicitud y extraer el 'total'
        data = json.loads(request.body)
        total = data.get('total', 0)  # Captura el 'total', predeterminado a 0 si no existe

        # Validación del monto
        if total <= 0:
            return JsonResponse({'success': False, 'message': 'Monto no válido'}, status=400)

        # Procesar la transacción si el monto es válido
        options = WebpayOptions(
            commerce_code='597055555532',
            api_key='579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        )
        tx = Transaction(options)
        response = tx.create(buy_order='order12345', session_id='session12345', amount=total, return_url='http://127.0.0.1:8000/modelo/pago_exitoso/')

        return JsonResponse({'success': True, 'transaction_url': response['url'], 'token': response['token']})

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def validar_pago(request):
    token_ws = request.POST.get('token_ws')
    if not token_ws:
        return JsonResponse({'success': False, 'message': 'Token no proporcionado'}, status=400)

    try:
        # Configurar las opciones de Transbank
        options = WebpayOptions(
            commerce_code='597055555532',
            api_key='579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
        )

        tx = Transaction(options)
        response = tx.commit(token_ws)

        # Validar el estado de la transacción
        if response['status'] == 'AUTHORIZED':
            return JsonResponse({'success': True, 'message': 'Pago autorizado correctamente'})
        else:
            return JsonResponse({'success': False, 'message': f"Transacción no autorizada, estado: {response['status']}"})

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@permission_classes([AllowAny])
def pago_exitoso(request):
    token_ws = request.GET.get('token_ws')

    if not token_ws:
        return JsonResponse({'success': False, 'message': 'Token no proporcionado'})

    try:
        response = Transaction().commit(token_ws)
        print("Response de Transbank:", response)  # Verificar la respuesta de Transbank

        if response['status'] == 'AUTHORIZED':
            # Redirigir a la ruta de Angular con el resultado de la transacción
            return redirect(f'http://localhost:8100/pago-exitoso?order={response}')
        else:
            return redirect('pago_fallido')

    except Exception as e:
        print("Error durante el procesamiento del pago:", str(e))  # Registro del error
        return JsonResponse({'success': False, 'error': str(e)})

@permission_classes([AllowAny])
def pago_fallido(request):
    # Aquí puedes hacer cualquier lógica que necesites antes de redirigir
    return redirect('http://localhost:8100/pago-fallido?message=El%20pago%20fue%20cancelado%20o%20fallido.%20Int%C3%A9ntalo%20de%20nuevo.')
