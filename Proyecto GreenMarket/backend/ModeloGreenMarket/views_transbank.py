from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
import json
from django.http import HttpResponse, JsonResponse
from transbank.webpay.webpay_plus.transaction import Transaction, WebpayOptions
from transbank.common.integration_type import IntegrationType
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.dateparse import parse_datetime
from .models import *
from transbank.webpay.webpay_plus.transaction import Transaction
import uuid
import logging
from django.core.mail import send_mail

#------------------------Vista Transbank---------------------------------------
logger = logging.getLogger(__name__)
@api_view(['POST'])
@permission_classes([AllowAny])
# Configura el logger


def iniciar_pago(request):
    try:
        # Obtener el cuerpo de la solicitud y extraer el 'total'
        data = json.loads(request.body)
        total = data.get('total', 0)  # Captura el 'total', predeterminado a 0 si no existe
        orden_id = data.get('orden_id')
        print(orden_id)
        # Validación del monto
        if total <= 0:
            return JsonResponse({'success': False, 'message': 'Monto no válido'}, status=400)

        # Generar valores únicos para buy_order y session_id
        buy_order = str(uuid.uuid4())[:26]  # Limitar a 26 caracteres
        session_id = str(uuid.uuid4())[:26]  # Limitar a 26 caracteres
        Orden.objects.filter(id=orden_id).update(
        buy_order = buy_order
        )
        # Procesar la transacción si el monto es válido
        options = WebpayOptions(
            commerce_code='597055555532',
            api_key='579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        )
        tx = Transaction(options)
        response = tx.create(buy_order=buy_order, session_id=session_id, amount=total, return_url='http://127.0.0.1:8000/modelo/pago_exitoso/')

        return JsonResponse({'success': True, 'transaction_url': response['url'], 'token': response['token']})

    except Exception as e:
        logger.error(f'Error al iniciar pago: {str(e)}')  # Registrar el error
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
        # Commit de la transacción en Transbank
        response = Transaction().commit(token_ws)
        # print("Response de Transbank:", response)  # Verificar la respuesta de Transbank

        if response['status'] == 'AUTHORIZED':
            # Extraer datos necesarios para guardar la transacción
            monto = response['amount']
            fecha = parse_datetime(response['transaction_date'])  # Guarda fecha y hora
            metodo_pago_code = response['payment_type_code']

            # Crear y guardar la nueva transacción sin utilizar el modelo MetodoPago
            nueva_transaccion = transaccion(
                metodo_pago=metodo_pago_code,  # Guardamos directamente el código del método de pago
                amount=monto,
                buy_order=response['buy_order'],
                status=response['status'],
                session_id=response['session_id'],
                transaction_date=fecha
            )
            nueva_transaccion.save()
            Orden.objects.filter(buy_order = response['buy_order']).update(
            pagado = True,
            orden_date = parse_datetime(response['transaction_date'])
            )
            Venta.objects.filter(buy_order = response['buy_order']).update(
            pagado = True,
            fecha_venta = parse_datetime(response['transaction_date'])
            )
            ventas = Venta.objects.filter(buy_order=response['buy_order'])
            proveedores = Proveedor.objects.filter(rut__in=[venta.id_proveedor.rut for venta in ventas])
            # generar_reporte_pdf(response["buy_order"], ventas, proveedores)
            notificados = set()
            for venta in ventas:
                print(venta)
                if venta.id_proveedor not in notificados:
                    try:
                        proveedor = Proveedor.objects.get(rut=venta.id_proveedor.rut)
                        send_mail(
                                'Notificación de Venta',
                                f'La venta con ID {venta.id_venta} ha sido marcada como pagada.',
                                'greenmarket408@gmail.com',
                                [proveedor.correo_electronico],  # Email del proveedor
                                fail_silently=False,
                                html_message=f'''
                                <html>
                                    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
                                        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; padding: 20px;">
                                            <h2 style="color: #0056b3; text-align: center;">Notificación de Venta</h2>
                                            <p style="font-size: 16px; line-height: 1.6;">Hola {proveedor.nombre} {proveedor.apellido},</p>
                                            <p style="font-size: 16px; line-height: 1.6;">
                                                Te informamos que has realizado una venta por {venta.monto_total} y ha sido marcada como pagada.
                                            </p>
                                            <p style="font-size: 14px; line-height: 1.6; color: #777; text-align: center;">
                                                Si tienes alguna consulta, por favor contáctanos.
                                            </p>
                                        </div>
                                        <footer style="text-align: center; padding: 20px 0; background-color: #28a745; color: #fff; border-radius: 10px; margin-top: 40px;">
                                            <p style="font-size: 14px;">&copy; 2024 GreenMarket. Todos los derechos reservados.</p>
                                        </footer>
                                    </body>
                                </html>
                                ''',
                            )
                        notificados.add(venta.id_proveedor)
                    except Proveedor.DoesNotExist:
                        print("error proveedor no encontrado al enviar correo")

            # Redirigir a la ruta de Angular con el resultado de la transacción
            return redirect(f'http://localhost:8100/pago-exitoso?order={response["buy_order"]}')
        else:
            # En caso de que la transacción no sea autorizada
            return redirect('pago_fallido')

    except Exception as e:  # Captura errores generales
        print("Error durante el procesamiento del pago:", str(e))  # Registro del error
        return JsonResponse({'success': False, 'error': str(e)})

def procesar_pago(request):
    # Suponiendo que tienes la respuesta de Transbank como un diccionario `response`
    response = {
        'payment_type_code': 'VD',  # Ejemplo de respuesta de Transbank
        'amount': 3500,
        'buy_order': 'order12345',
        'status': 'AUTHORIZED',
        'session_id': 'session12345',
        'transaction_date': '2024-11-04T23:48:39.707Z'
        # otros campos necesarios
    }

    # Crear una instancia de Transaccion con el método de pago y otros datos
    transaccion = transaccion(
        metodo_pago=response.get('payment_type_code'),  # Guarda el tipo de pago 'VD', 'VN', etc.
        amount=response.get('amount'),
        buy_order=response.get('buy_order'),
        status=response.get('status'),
        session_id=response.get('session_id'),
        transaction_date=response.get('transaction_date')
    )

    try:
        transaccion.save()
        print("Transacción guardada correctamente.")
    except Exception as e:
        print(f"Error durante el procesamiento del pago: {e}")

    # Resto de tu lógica de respuesta
    return render(request, 'pago_exitoso.html')

def detalles_pago_exitoso(request):
    buy_order = request.GET.get('order')

    if not buy_order:
        return JsonResponse({'success': False, 'message': 'Order ID no proporcionado'}, status=400)

    try:
        # Buscar la transacción por buy_order
        transaccion_obj = transaccion.objects.get(buy_order=buy_order)

        # Serializar los datos de la transacción
        data = {
            'metodo_pago': transaccion_obj.metodo_pago,  # Método de pago (código de Transbank)
            'amount': transaccion_obj.amount,
            'buy_order': transaccion_obj.buy_order,
            'status': transaccion_obj.status,
            'session_id': transaccion_obj.session_id,
            'transaction_date': transaccion_obj.transaction_date.strftime('%Y-%m-%d %H:%M:%S'),
        }

        return JsonResponse({'success': True, 'data': data})

    except transaccion.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Transacción no encontrada'}, status=404)

@permission_classes([AllowAny])
def pago_fallido(request):
    # Aquí puedes hacer cualquier lógica que necesites antes de redirigir
    return redirect('http://localhost:8100/pago-fallido?message=El%20pago%20fue%20cancelado%20o%20fallido.%20Int%C3%A9ntalo%20de%20nuevo.')