from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
import requests
import logging  # Para registrar errores
from django.shortcuts import render
import io


# Create your views here.

# ---------------------------------------Proveedor---------------------------------------------
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def Ver_proveedor(request):
    if request.method == 'GET':
        proveedores = Proveedor.objects.all()
        serializer = ProveedorSerializer(proveedores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])  # Asegura que solo los usuarios autenticados puedan acceder
def proveedor_detalle(request, id):
    try:
        proveedor = Proveedor.objects.get(rut=id)
    except Proveedor.DoesNotExist:
        return Response({"error": "Proveedor no encontrado"}, status=404)

    if request.method == 'GET':
        serializer = ProveedorSerializer(proveedor)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProveedorSerializer(proveedor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# -------------------------------- Vista de Categoría ---------------------------------------------
@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def get_categoria(request):
    """
    Lista de categorías, o crea una nueva categoría.
    """
    if request.method == 'GET':
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        categoria_data = JSONParser().parse(request)
        categoria_serializer = CategoriaSerializer(data=categoria_data)
        if categoria_serializer.is_valid():
            categoria_serializer.save()
            return JsonResponse(categoria_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(categoria_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def Filtrar_categoria(request):
    """
    Lista de categorías con opción de filtrado por nombre.
    """
    nombre_categoria = request.GET.get('nombre_categoria', None)

    if nombre_categoria:
        categorias = Categoria.objects.filter(nombre_categoria__icontains=nombre_categoria)
    else:
        categorias = Categoria.objects.all()
    
    serializer = CategoriaSerializer(categorias, many=True)
    return JsonResponse(serializer.data, safe=False)

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def productos_por_categoria(request):
    """
    Lista productos por categoría.
    """
    id_categoria = request.GET.get('id_categoria', None)
    
    if id_categoria:
        productos = Producto.objects.filter(id_categoria=id_categoria)
    else:
        productos = Producto.objects.all()
    
    serializer = ProductoSerializer(productos, many=True)
    return JsonResponse(serializer.data, safe=False)

@csrf_exempt
@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def detalle_categoria(request, id):
    """
    Actualiza o elimina una categoría.
    """
    try:
        categoria = Categoria.objects.get(id_categoria=id)
    except Categoria.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        categoria_data = JSONParser().parse(request)
        categoria_serializer = CategoriaSerializer(categoria, data=categoria_data)
        if categoria_serializer.is_valid():
            categoria_serializer.save()
            return JsonResponse(categoria_serializer.data)
        return JsonResponse(categoria_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        categoria.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

# -------------------------- Cliente -----------------------------
@csrf_exempt
@permission_classes([AllowAny])
def cliente_obtener(request, rut):
    cliente = get_object_or_404(Cliente, rut=rut) 
    response_data = {
        'dv': cliente.dv,
        'correo_electronico': cliente.correo_electronico,
        'nombre': cliente.nombre,
        'direccion': cliente.direccion,
        'contrasena': cliente.contrasena
    }
    return JsonResponse(response_data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def guardar_cliente(request):
    if request.method == 'POST':
        cliente_data = JSONParser().parse(request)
        cliente_serializer = ClienteSerializer(data=cliente_data)
        
        if cliente_serializer.is_valid():
            cliente_serializer.save()
            return JsonResponse(cliente_serializer.data, status=status.HTTP_201_CREATED)
        
        return JsonResponse(cliente_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

# -------------------------- Historial -----------------------------
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def historial_compras(request, rut):
    try:
        ordenes = Orden.objects.all()
        ordenes = Orden.objects.filter(cliente=rut)
        serializer = OrdenSerializer(ordenes, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
    except Orden.DoesNotExist:
        return Response({"detail": "No se encontraron órdenes para este RUT."}, status=status.HTTP_404_NOT_FOUND)
    
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def historial_ventas(request, rut):
    try:
        ventas = Venta.objects.all()
        ventas = Venta.objects.filter(id_proveedor=rut)
        serializer = VentaSerializer(ventas, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
    except Venta.DoesNotExist:
        return Response({"detail": "No se encontraron órdenes para este RUT."}, status=status.HTTP_404_NOT_FOUND)

# --------------------------- Chatbot ---------------------------
def analizar_imagen(request):
    if request.method == "POST" and request.FILES.get('image'):
        image = request.FILES['image']
        
        # Aquí colocas el código para enviar la imagen a Azure para su análisis
        subscription_key = "5v3OzDuofQrJC2YNWOrJuMVDN39vXd9owQ528vYgjwaCNPqYltyyJQQJ99ALACYeBjFXJ3w3AAAFACOG5nor"
        endpoint = "eastus"
        url = endpoint + "https://plantrecognitionservice.cognitiveservices.azure.com/"
        
        image_data = image.read()

        params = {
            "visualFeatures": "Categories,Description,Tags",
            "language": "es"
        }

        headers = {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": subscription_key
        }

        response = requests.post(url, headers=headers, params=params, data=image_data)

        if response.status_code == 200:
            analysis = response.json()
            descripcion = analysis["description"]["captions"][0]["text"]
            etiquetas = analysis["tags"]
            return JsonResponse({"descripcion": descripcion, "etiquetas": etiquetas})
        else:
            return JsonResponse({"error": "Error al procesar la imagen"}, status=500)

    return render(request, 'subir_imagen.html')
    
@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']  # Obtén la imagen del request
        try:
            resultado = procesar_imagen_con_custom_vision(image)  # Procesa la imagen
            return JsonResponse(resultado)  # Devuelve el resultado al cliente
        except Exception as e:
            return JsonResponse({"error": f"Error procesando la imagen: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "No se proporcionó ninguna imagen"}, status=400)


logger = logging.getLogger(__name__)
@csrf_exempt
def analizar_imagen(request):
    if request.method == "POST" and request.FILES.get('image'):
        image = request.FILES['image']

        # Convertir la imagen a un objeto de archivo en memoria
        image_in_memory = io.BytesIO(image.read())  # Convertir la imagen a BytesIO

        try:
            # Procesar la imagen con Custom Vision
            result = procesar_imagen_con_custom_vision(image_in_memory)
            
            if 'error' in result:
                return JsonResponse(result, status=500)

            # Devolver los resultados del análisis
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({"error": f"Error interno: {str(e)}"}, status=500)

    return JsonResponse({"error": "No se proporcionó ninguna imagen"}, status=400)


# Configuración de Custom Vision
PREDICTION_KEY = "7Jt5yRRau9l3tap1z7SzsFUKlPiJhUbnI4ak49OdW3DpugvXOWTlJQQJ99ALACYeBjFXJ3w3AAAIACOGOKPV"
ENDPOINT = "https://customvisionplantas-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/33ecdaca-6aea-4e10-b6ab-e65db4551626/classify/iterations/Iteration2/image"

def procesar_imagen_con_custom_vision(image_file):
    try:
        # Leer la imagen en formato binario
        image_data = image_file.read()

        # Configurar los headers
        headers = {
            "Prediction-Key": PREDICTION_KEY,
            "Content-Type": "application/octet-stream"
        }

        # Realizar la solicitud a la API de Custom Vision
        response = requests.post(ENDPOINT, headers=headers, data=image_data)

        # Validar el código de respuesta
        if response.status_code != 200:
            return {"error": f"Error en la solicitud: {response.status_code}, {response.text}"}

        # Procesar la respuesta de la API
        result = response.json()
        predicciones = [
            {"etiqueta": pred["tagName"], "probabilidad": pred["probability"]}
            for pred in result.get("predictions", [])
        ]
        
        return {"resultados": predicciones}

    except Exception as e:
        return {"error": str(e)}