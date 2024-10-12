from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from .models import Producto, Cliente, Orden, CarritoM, ItemCarrito
from .carrito import Carrito
from django.views.decorators.csrf import csrf_exempt
from .serializers import ClienteSerializer
from django.views.decorators.http import require_POST

@csrf_exempt
@require_POST
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
def limpiar_carrito(request):
    carrito = Carrito(request)
    carrito.limpiar()
    return JsonResponse({'mensaje': 'Carrito Limpiado'})

@csrf_exempt
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
    print(request.method)
    if request.method == 'POST':
        # Obtener datos del cliente desde la solicitud
        cliente_data = JSONParser().parse(request)
        rut = cliente_data.get('rut')
        correo_electronico = cliente_data.get('correo_electronico')
        # Buscar si ya existe un cliente con ese rut o correo
        try:
            cliente = Cliente.objects.get(rut=rut, correo_electronico=correo_electronico)
        except Cliente.DoesNotExist:
            cliente = None
        
        if cliente is None:
            # Si no existe, crear un nuevo cliente
            cliente_serializers = ClienteSerializer(data=cliente_data)
            if cliente_serializers.is_valid():
                cliente = cliente_serializers.save()
            else:
                return JsonResponse({'error': 'Datos de cliente inválidos'}, status=400)
        else:
            # Si existe, actualizar sus datos con los proporcionados
            cliente.nombre = cliente_data.get('nombre', cliente.nombre)
            cliente.direccion = cliente_data.get('direccion', cliente.direccion)
            cliente.save()
        # Obtener los datos del carrito
        carrito = Carrito(request)
        items, total = carrito.obtener_items()
        # Crear la lista de ítems para la orden
        items_orden = [{'producto_id': item['producto'].codigo_producto, 'cantidad': item['cantidad']} for item in items]
        # Crear la orden
        orden = Orden.objects.create(
            cliente=cliente,
            items=items_orden,
            total=total,
            pagado=False,
        )
        # Limpiar el carrito después de crear la orden
        carrito.limpiar()
        # Retornar la respuesta de éxito junto con los datos del cliente
        return JsonResponse({'mensaje': 'Orden creada', 'orden_id': orden.id, 'cliente': ClienteSerializer(cliente).data})
    return JsonResponse({'error': 'Método no permitido'}, status=405)