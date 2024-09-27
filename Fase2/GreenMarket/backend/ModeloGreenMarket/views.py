from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from . import models
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view

# Create your views here.

# ---------------------------------------Proveedor---------------------------------------------
@csrf_exempt
@api_view(['GET'])
def Ver_proveedor(request):
    if request.method == 'GET':
        proveedores = models.Proveedor.objects.all()
        serializer = ProveedorSerializer(proveedores, many=True)
        return JsonResponse(serializer.data, safe=False)
@csrf_exempt
@api_view(['POST'])
def agregar_proveedor_admin(request):
    if request.method == 'POST':
        form = Proveedor(request.POST)
        if form.is_valid():
            # Se obtienen los datos del formulario
            rut = form.cleaned_data['rut']
            correo = form.cleaned_data['correo_electronico']
            nombre = form.cleaned_data['nombre']
            apellido = form.cleaned_data['apellido']
            password = form.cleaned_data['password']
            
            # El administrador crea al proveedor
            User.objects.create_proveedor_admin(
                rut=rut,
                correo_user=correo,
                nom_user=nombre,
                ap_user=apellido,
                password=password
            )
            return redirect('lista_proveedores')
    else:
        form = Proveedor()

    return render(request, 'agregar_proveedor.html', {'form': form})

@csrf_exempt
@api_view(['POST'])
def registro_proveedor(request):
    if request.method == 'POST':
        form = Proveedor(request.POST)
        if form.is_valid():
            # Crear proveedor por sí mismo
            rut = form.cleaned_data['rut']
            correo = form.cleaned_data['correo_electronico']
            nombre = form.cleaned_data['nombre']
            apellido = form.cleaned_data['apellido']
            password = form.cleaned_data['password']
            
            # Crear proveedor
            User.objects.create_proveedor(
                rut=rut,
                correo_user=correo,
                nom_user=nombre,
                ap_user=apellido,
                password=password
            )
            return redirect('login')
    else:
        form = Proveedor()

    return render(request, 'registro_proveedor.html', {'form': form})

def lista_proveedores(request):
    proveedores = models.Proveedor.objects.all()
    return render(request, 'lista_proveedores.html', {'proveedores': proveedores})

@csrf_exempt
@api_view(['PUT', 'DELETE'])
def detalle_proveedor(request, id):
    """
    Actualiza o elimina un proveedor.
    """
    try:
        proveedor = models.Proveedor.objects.get(rut=id)
    except models.Proveedor.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        proveedor_data = JSONParser().parse(request)
        proveedor_serializer = ProveedorSerializer(proveedor, data=proveedor_data)
        if proveedor_serializer.is_valid():
            proveedor_serializer.save()
            return JsonResponse(proveedor_serializer.data)
        return JsonResponse(proveedor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        proveedor.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

# -----------------------------------------Vista de Producto---------------------------------------------
@csrf_exempt
@api_view(['GET', 'POST'])
def producto(request):
    """
    Lista de productos, o crea un nuevo producto.
    """
    if request.method == 'GET':
        productos = models.Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        productos_data = JSONParser().parse(request)
        productos_serializer = ProductoSerializer(data=productos_data)
        if productos_serializer.is_valid():
            productos_serializer.save()
            return JsonResponse(productos_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(productos_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['PUT', 'DELETE'])
def detalle_producto(request, id):
    """
    Actualiza o elimina un producto.
    """
    try:
        producto = models.Producto.objects.get(id_producto=id)
    except models.Producto.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        producto_data = JSONParser().parse(request)
        producto_serializer = ProductoSerializer(producto, data=producto_data)
        if producto_serializer.is_valid():
            producto_serializer.save()
            return JsonResponse(producto_serializer.data)
        return JsonResponse(producto_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        producto.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)
    
# -------------------------------- Vista de Categoría ---------------------------------------------
@csrf_exempt
@api_view(['GET', 'POST'])
def get_categoria(request):
    """
    Lista de categorías, o crea una nueva categoría.
    """
    if request.method == 'GET':
        categorias = models.Categoria.objects.all()
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
@api_view(['PUT', 'DELETE'])
def detalle_categoria(request, id):
    """
    Actualiza o elimina una categoría.
    """
    try:
        categoria = models.Categoria.objects.get(id_categoria=id)
    except models.Categoria.DoesNotExist:
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

# --------------------------------- Vista de Carrito ---------------------------------------------
@csrf_exempt
@api_view(['GET'])
def listar_carrito(request, id):
    if request.method == 'GET':
        try:
            carrito = Carrito.objects.get(id_usuario=id)
        except Carrito.DoesNotExist:
            return JsonResponse({"data": "null", "message": "No existe el carrito"}, status=status.HTTP_404_NOT_FOUND)

        carrito_serializer = CarritoSerializer(carrito)
        return JsonResponse({"data": carrito_serializer.data, "message": "Carrito encontrado"}, status=status.HTTP_200_OK)
    
@csrf_exempt
@api_view(['POST'])
def agregar_carrito(request):
    if request.method == 'POST':
        carrito_data = JSONParser().parse(request)
        carrito_serializer = AgregarCarritoSerializer(data=carrito_data)
        if carrito_serializer.is_valid():
            carrito_serializer.save()
            return JsonResponse({"data": carrito_serializer.data, "message": "Producto agregado al carrito"}, status=status.HTTP_201_CREATED)
        return JsonResponse(carrito_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
@api_view(['POST'])
def eliminar_carritoitem(request):
    if request.method == 'POST':
        carritoitem_data = JSONParser().parse(request)
        carritoitem_serializer = RestarCarritoSerializer(data=carritoitem_data)
        if carritoitem_serializer.is_valid():
            carritoitem_serializer.save()
            return JsonResponse({"data": carritoitem_serializer.data, "message": "Se elimino una unidad del producto seleccionado"}, status=status.HTTP_200_OK)
        return JsonResponse(carritoitem_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def limpiar_carrito(id_carrito:int):
    items_usuario = Items.objects.filter(id_carrito=id_carrito)
    for items in items_usuario:
        items.delete()