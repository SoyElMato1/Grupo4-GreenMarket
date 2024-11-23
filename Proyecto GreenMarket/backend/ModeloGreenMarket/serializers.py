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
        fields = ['rut', 'dv', 'correo_electronico', 'contrasena', 'nombre', 'apellido', 'direccion','verificacion','foto']
        read_only_fields = ['verificacion']  # Para que estos campos no puedan ser modificados directamente
    
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
        fields = ['rut', 'dv', 'correo_electronico', 'contrasena', 'nombre', 'direccion']

# Producto
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id_categoria', 'nombre_categoria']

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['codigo_producto', 'nombre_producto', 'precio', 'imagen_producto', 'descripcion', 'id_categoria', 'id_proveedor']

# Venta
# class MetodoPagoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MetodoPago
#         fields = ['id_metodo_pago', 'nombre_metodo']

class TransaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = transaccion
        fields = ['id_transaccion', 'monto', 'fecha']

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = ['id_venta', 'fecha_venta', 'monto_total', 'id_cliente', 'id_carrito', 'transaccion']

class OrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orden
        fields = ['cliente','total','pagado', 'items', 'buy_order', 'orden_date']