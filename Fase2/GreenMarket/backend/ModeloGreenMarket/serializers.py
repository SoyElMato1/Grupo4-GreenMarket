from rest_framework import serializers, status
from .models import *
from django.http import Http404

# Usuarios
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'correo_user', 'password', 'rut', 'nom_user', 'ap_user', 'is_active', 'is_staff', 'rol']
        extra_kwargs = {"password": {"write_only": True, "min_length": 8}}

    def create(self, validated_data):
        cliente = User.objects.create_usercli(**validated_data)
        return cliente
    
    def create_proveedor(self, validated_data):
        proveedor = User.objects.create_proveedor(**validated_data)
        return proveedor
    
    def create_proveedor_admin(self, validated_data):
        proveedor = User.objects.create_proveedor_admin(**validated_data)
        return proveedor
    
    def create_user_from_cart(self, validated_data):
        cliente = User.objects.create_user_from_cart(**validated_data)
        return cliente

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['rut', 'dv', 'correo_electronico', 'nombre', 'apellido', 'recompensa', 'verificacion']
        read_only_fields = ['recompensa', 'verificacion']  # Para que estos campos no puedan ser modificados directamente

    def get_calificacion_productos(self, obj):
        # Obtener la puntuación promedio de los productos
        total_puntuacion = obj.producto_set.aggregate(models.Sum('calificaciones__puntuacion'))['calificaciones__puntuacion__sum'] or 0
        num_productos = obj.producto_set.count()
        if num_productos > 0:
            return total_puntuacion / num_productos
        return 0

    def get_calificacion_proveedor(self, obj):
        # Obtener la puntuación promedio del proveedor
        total_puntuacion = obj.calificaciones_proveedor.aggregate(models.Sum('puntuacion'))['puntuacion__sum'] or 0
        num_calificaciones = obj.calificaciones_proveedor.count()
        if num_calificaciones > 0:
            return total_puntuacion / num_calificaciones
        return 0
    
class calificacionProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionProveedor
        fields = ['id_calificacionProve', 'puntuacion', 'comentario', 'id_proveedor', 'id_cliente']
        read_only_fields = ['id_cliente']

    def create(self, validated_data):
        # Asegurarse de que la calificación la realiza el cliente autenticado
        validated_data['cliente'] = self.context['request'].user
        return super().create(validated_data)
    
class calificacionProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionProducto
        fields = ['id_calificacionProduc', 'puntuacion', 'comentario', 'id_producto', 'id_cliente']
        read_only_fields = ['id_cliente']

    def create(self, validated_data):
        # Asegurarse de que la calificación la realiza el cliente autenticado
        validated_data['cliente'] = self.context['request'].user
        return super().create(validated_data)

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['rut', 'dv', 'correo_electronico', 'nombre', 'direccion']

# Producto
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id_categoria', 'nombre_categoria']

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['codigo_producto', 'nombre_producto', 'precio', 'imagen_producto', 'id_categoria', 'id_proveedor']

# Carrito

class UnProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["imagen_producto", "nom_producto", "precio"]

class ItemsSerializer(serializers.ModelSerializer):
    producto = UnProductoSerializer(many=False)
    precio = serializers.SerializerMethodField(method_name="total")

    class Meta:
        model = Items
        fields = ["id_carrito", "producto", "cantidad", "precio"]

    def total(self, item: Items):
        precio = item.cantidad * item.producto.precio
        return precio

class CarritoSerializer(serializers.ModelSerializer):
    items = ItemsSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField(method_name="precio_total")

    class Meta:
        model = Carrito
        fields = ["id_carrito", "items", "total", "cliente"]

    def precio_total(self, carrito: Carrito):
        items = carrito.items.all()
        total = sum([item.cantidad * item.producto.precio for item in items])
        return total

    def create(self, validated_data):
        carrito = Carrito.objects.create(**validated_data)
        return carrito

class AgregarCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = ["producto", "cantidad", "id_carrito"]

    def save(self):
        producto = self.validated_data["producto"]
        cantidad = self.validated_data["cantidad"]
        id_carrito = self.validated_data["id_carrito"]

        try:
            cartitem = Items.objects.get(id_carrito=id_carrito, producto=producto)
            cartitem.cantidad += cantidad
            cartitem.precio = cartitem.cantidad * cartitem.producto.precio
            cartitem.save()
            self.instance = cartitem
        except Items.DoesNotExist:
            producto2 = Producto.objects.get(codigo_producto=int(producto.codigo_producto))
            nuevoPrecio = producto2.precio* cantidad
            self.instance = Items.objects.create(
                producto=producto,
                id_carrito=id_carrito,
                cantidad=cantidad,
                precio=nuevoPrecio
            )
            return self.instance

class RestarCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = ["producto", "id_carrito"]
    def save(self):
        try:
            producto = self.validated_data["producto"]
            id_carrito = self.validated_data["id_carrito"] 
        except KeyError:
            raise Http404
        try:
            cartitem = Items.objects.get(producto=producto, id_carrito=id_carrito)
        except Items.DoesNotExist:
            raise Http404
        if cartitem.cantidad == 1:
            cartitem.delete()
            return self.instance

        cartitem.cantidad -= 1
        cartitem.precio = cartitem.cantidad * cartitem.producto.precio
        cartitem.save()

        return self.instance

# Venta

class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = ['id_metodo_pago', 'nombre_metodo']

class TransaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = transaccion
        fields = ['id_transaccion', 'monto', 'fecha', 'id_metodo_pago']

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = ['id_venta', 'fecha_venta', 'monto_total', 'id_cliente', 'id_carrito', 'metodo_pago', 'transaccion']
