from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
import base64
from django.conf import settings
from django.core.files import File
import os

# -----------------------------------------Vista de Producto---------------------------------------------
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def producto(request):
    """
    Lista de productos, o crea un nuevo producto.
    """
    if request.method == 'GET':
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return JsonResponse(serializer.data, safe=False)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def agregar_productos(request):
    if request.method == 'POST':
        productos_data = JSONParser().parse(request)
        productos_serializer = ProductoSerializer(data=productos_data)
        if productos_serializer.is_valid():
            productos_serializer.save()
            return JsonResponse(productos_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(productos_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])  # Permite acceso sin autenticación
def obtener_productos(request):
    """
    Lista productos por el RUT del proveedor o agrega un nuevo producto.
    """
    if request.method == 'GET':
        rut_proveedor = request.GET.get('rut')
        
        if rut_proveedor:
            try:
                proveedor = Proveedor.objects.get(rut=rut_proveedor)
                productos = Producto.objects.filter(id_proveedor=proveedor)
            except Proveedor.DoesNotExist:
                return JsonResponse({"error": "Proveedor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            productos = Producto.objects.all()
        
        serializer = ProductoSerializer(productos, many=True)
        return JsonResponse(serializer.data, safe=False)

#Traer los productos del franco
@csrf_exempt
@api_view(["GET"])
@permission_classes([AllowAny])
def obtener_producto(request, id):
    try:
        producto = Producto.objects.get(codigo_producto=id)
        serializer = ProductoSerializer(producto)
        return JsonResponse(serializer.data)
    except Producto.DoesNotExist:
        return JsonResponse({"detail": "Producto no encontrado"}, status=404)
    


# Trae el producto del proveedor
@csrf_exempt
@api_view(["GET"])
@permission_classes([AllowAny])
def producto_proveedor(request, id):
    if request.method == "GET":
        producto = get_object_or_404(Producto, codigo_producto=id)
        producto_data = {
            'codigo_producto': producto.codigo_producto,
            'nombre_producto': producto.nombre_producto,
            'precio': producto.precio,
            'imagen_producto': producto.imagen_producto.url,
            'descripcion': producto.descripcion,
            'id_categoria': producto.id_categoria.id_categoria,
            'id_proveedor': producto.id_proveedor.rut
        }
        return JsonResponse(producto_data, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
# Agregar Producto
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def agregar_producto(request):
    if request.method == 'POST':
        producto_data = request.data.get('producto')
        rut_proveedor = request.data.get('rut_proveedor')
        # Verificar si producto_data y rut_proveedor existen
        if not producto_data or not rut_proveedor:
            return JsonResponse({"error": "Datos incompletos: 'producto' o 'rut_proveedor' no proporcionados"},
                                status=status.HTTP_400_BAD_REQUEST)
        try:
            proveedor = Proveedor.objects.get(rut=rut_proveedor)
        except Proveedor.DoesNotExist:
            return JsonResponse({"error": "Proveedor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        try:
            categoria = Categoria.objects.get(id_categoria=producto_data.get('id_categoria'))
        except Categoria.DoesNotExist:
            return JsonResponse({"error": "Categoría no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        # Asignar los valores de proveedor y categoría al producto
        producto_data['id_proveedor'] = proveedor.rut
        producto_data['id_categoria'] = categoria.id_categoria
        if 'imagen_producto' in producto_data:
            imagen_data = producto_data.pop('imagen_producto')
            format, imgstr = imagen_data.split(';base64,')
            print(imagen_data)
            ext = format.split('/')[-1]
            imagen_file = ContentFile(base64.b64decode(imgstr), name=f'producto.{ext}')
            producto_data['imagen_producto'] = imagen_file
        producto_serializer = ProductoSerializer(data=producto_data)
        if producto_serializer.is_valid():
            producto_serializer.save()
            return JsonResponse(producto_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(producto_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def actualizar_eliminar_producto(request, id):
    try:
        producto = Producto.objects.get(codigo_producto=id)
    except Producto.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'PUT': 
        producto_data = request.data.get('producto', {}).copy()
        if 'imagen_producto' in producto_data:
            imagen_data = producto_data.pop('imagen_producto')
            if imagen_data.startswith('/media/'):
                imagen_path = os.path.join(settings.MEDIA_ROOT, imagen_data.lstrip('/'))
                if os.path.exists(imagen_path):
                    with open(imagen_path, 'rb') as image_file:
                        imagen_file_django = File(image_file, name=os.path.basename(imagen_path))
                        producto_data['imagen_producto'] = imagen_file_django
            else:
                format, imgstr = imagen_data.split(';base64,')
                ext = format.split('/')[-1]
                imagen_file = ContentFile(base64.b64decode(imgstr), name=f'producto.{ext}')
                producto_data['imagen_producto'] = imagen_file
        producto_serializer = ProductoSerializer(producto, data=producto_data, partial=True)
        if producto_serializer.is_valid():
            producto_serializer.save()
            return JsonResponse(producto_serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(producto_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        producto.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)