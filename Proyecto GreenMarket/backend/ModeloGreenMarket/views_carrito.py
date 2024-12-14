import json
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from .models import *
from .carrito import Carrito
from django.views.decorators.csrf import csrf_exempt
from .serializers import ClienteSerializer
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

@csrf_exempt
@require_POST
@permission_classes([AllowAny])
def agregar_al_carrito(request, producto_id):
    # Obtener el usuario autenticado o dejar como None para usuarios anónimos
    usuario = request.user if request.user.is_authenticated else None
    # Obtener o crear un carrito para el usuario (o carrito anónimo)
    carrito, creado = CarritoM.objects.get_or_create(cliente=usuario)
    try:
        producto = Producto.objects.get(codigo_producto=producto_id)
    except Producto.DoesNotExist:
        return JsonResponse({'error': 'Producto no encontrado'}, status=404)
    # Verificar si el producto ya está en el carrito
    item_carrito, creado = ItemCarrito.objects.get_or_create(
        carrito=carrito,
        producto=producto,
        defaults={'precio': producto.precio, 'cantidad': 1}
    )
    # Si ya está en el carrito, solo aumentamos la cantidad
    if not creado:
        item_carrito.cantidad += 1
        item_carrito.save()
    # Obtener el nuevo estado del carrito
    items = carrito.items.all()
    total = sum(item.subtotal() for item in items)
    items_serializados = [{
        'producto_id': item.producto.codigo_producto,
        'nombre': item.producto.nombre_producto,
        'cantidad': item.cantidad,
        'precio': str(item.precio),
        'subtotal': str(item.subtotal()),
    } for item in items]
    return JsonResponse({'mensaje': 'Producto agregado al carrito', 'items': items_serializados, 'total': str(total)})

@csrf_exempt
@permission_classes([AllowAny])
def eliminar_del_carrito(request, producto_id):
    if request.method == 'POST':  # Asegúrate de que solo se acepte POST
        carrito = Carrito(request)
        
        try:
            producto = Producto.objects.get(codigo_producto=producto_id)
        except Producto.DoesNotExist:
            return JsonResponse({'error': 'Producto no encontrado'}, status=404)
        
        carrito.eliminar(producto)
        return JsonResponse({'mensaje': 'Producto eliminado del carrito'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@permission_classes([AllowAny])
def restar_producto(request, producto_id):
    if request.method == 'POST':  # Asegúrate de que solo se acepte POST
        carrito = Carrito(request)
        try:
            producto = Producto.objects.get(codigo_producto=producto_id)
        except Producto.DoesNotExist:
            return JsonResponse({'error': 'Producto no encontrado'}, status=404)
        
        carrito.restar(producto)
        return JsonResponse({'mensaje': 'Producto restado del carrito'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@permission_classes([AllowAny])
def limpiar_carrito(request):
    if request.method == 'POST':
        carrito = Carrito(request)
        carrito.limpiar()
        return JsonResponse({'mensaje': 'Carrito Limpiado'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
@permission_classes([AllowAny])
def ver_carrito(request):
    carrito = Carrito(request)
    items, total = carrito.obtener_items()  # Asegúrate de que esta función esté funcionando correctamente
    items_serializados = [{
        'producto_id': item['producto'].codigo_producto,
        'nombre': item['producto'].nombre_producto,
        'cantidad': item['cantidad'],
        'precio': str(item['producto'].precio),
        'subtotal': str(item['subtotal']),
    } for item in items]

    return JsonResponse({'items': items_serializados, 'total': str(total)})

@csrf_exempt
def checkout(request):
    if request.method == 'POST':
        # Obtener datos del cliente desde la solicitud
        cliente_data = JSONParser().parse(request)
        rut = cliente_data.get('rut')

        # Buscar o crear el cliente automáticamente
        cliente, created = Cliente.objects.get_or_create(
            rut=rut,
            defaults={
                'nombre': cliente_data.get('nombre'),
                'correo_electronico': cliente_data.get('correo_electronico'),
                'direccion': cliente_data.get('direccion'),
                'dv': cliente_data.get('dv'),
                'contrasena': cliente_data.get('contrasena')
            }
        )

        # Verificar si hubo algún problema con los datos de cliente
        if not created and not cliente:
            return JsonResponse({'error': 'Datos de cliente inválidos'}, status=400)

        # Obtener los datos del carrito
        carrito = Carrito(request)
        items, total = carrito.obtener_items()

        productos = [
                (item['producto'], item['cantidad'], item['producto'].id_proveedor) 
                for item in items
            ]
        
        # Crear la lista de ítems para la orden
        items_orden = [{'producto_id': item['producto'].codigo_producto, 'cantidad': item['cantidad']} for item in items]

        # Crear la orden
        orden = Orden.objects.create(
            cliente=cliente,
            items=items_orden,
            total=total,
            pagado=False,
        )

        productos_por_proveedor = {}
        for producto, cantidad, proveedor in productos:
            if proveedor not in productos_por_proveedor:
                productos_por_proveedor[proveedor] = []
            productos_por_proveedor[proveedor].append((producto, cantidad))
        # Crear una venta por cada proveedor
        ventas = {}
        for proveedor, items in productos_por_proveedor.items():
            # Calcular el monto total para todos los productos de este proveedor
            total_por_proveedor = sum(producto.precio * cantidad for producto, cantidad in items)
            # Crear la venta para el proveedor
            venta = Venta.objects.create(
                id_proveedor=proveedor,
                monto_total=total_por_proveedor,
                pagado=False,
                id_orden = orden,
                items = items_orden
            )
            ventas[proveedor] = {
                'venta': venta,
                'productos': items,
            }

        # Limpiar el carrito después de crear la orden
        carrito.limpiar()

        # Retornar la respuesta de éxito junto con los datos del cliente
        return JsonResponse({'mensaje': 'Orden creada', 'orden_id': orden.id, 'cliente': ClienteSerializer(cliente).data})

    return JsonResponse({'error': 'Método no permitido'}, status=405)

#------------------------ Views Chatbot -------------------------------------
@csrf_exempt
@require_POST
@permission_classes([AllowAny])
def agregar_al_carrito_bot(request):
    import json
    from django.http import JsonResponse

    try:
        # Intentamos decodificar los datos JSON enviados
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        plant_name = body.get('plant_name')
        
        if not plant_name:
            return JsonResponse({'error': 'El nombre de la planta es obligatorio'}, status=400)

        # Obtener o crear un carrito anónimo (ya que el bot puede no tener usuario autenticado)
        carrito, _ = CarritoM.objects.get_or_create(cliente=None)

        # Buscar productos por nombre
        productos = Producto.objects.filter(nombre_producto=plant_name)

        if not productos.exists():
            return JsonResponse({'error': 'Producto no encontrado'}, status=404)

        # Si hay más de un producto con el mismo nombre, tomaremos el primero
        producto = productos.first()

        # Agregar al carrito
        item_carrito, creado = ItemCarrito.objects.get_or_create(
            carrito=carrito,
            producto=producto,
            defaults={'precio': producto.precio, 'cantidad': 1}
        )
        if not creado:
            item_carrito.cantidad += 1
            item_carrito.save()

        # Respuesta con los detalles del carrito
        items = carrito.items.all()
        total = sum(item.subtotal() for item in items)
        items_serializados = [
            {
                'producto_id': item.producto.codigo_producto,
                'nombre': item.producto.nombre_producto,
                'cantidad': item.cantidad,
                'precio': str(item.precio),
                'subtotal': str(item.subtotal()),
            }
            for item in items
        ]
        return JsonResponse({'mensaje': 'Producto agregado al carrito', 'items': items_serializados, 'total': str(total)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)