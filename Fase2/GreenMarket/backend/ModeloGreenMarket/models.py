from django.db import models

# Create your models here.

class Admin (models.Model):
    id_admin = models.AutoField(primary_key=True)
    correo = models.EmailField(max_length=50)
    password = models.CharField(max_length=50)

class Proveedor (models.Model):
    rut = models.CharField(max_length=10, primary_key=True)
    dv = models.CharField(max_length=1)
    correo_electronico = models.EmailField(max_length=50)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    verificacion = models.BooleanField(default=False)
    recompensa = models.IntegerField(default=0)

class Cliente (models.Model):
    rut = models.CharField(max_length=10, primary_key=True)
    dv = models.CharField(max_length=1)
    correo_electronico = models.EmailField(max_length=50)
    nombre = models.CharField(max_length=50)
    direccion = models.CharField(max_length=50)

class Categoria (models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=50)

class Producto (models.Model):
    codigo_producto = models.AutoField(primary_key=True)
    nombre_producto = models.CharField(max_length=50)
    precio = models.IntegerField()
    imagen_producto = models.ImageField(upload_to='productos/')
    id_categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    id_proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)

class Carrito (models.Model):
    id_carrito = models.AutoField(primary_key=True)
    monto_total = models.IntegerField()
    
class Items (models.Model):
    id_item = models.AutoField(primary_key=True)
    cantidad = models.IntegerField()
    precio_unitario = models.IntegerField()
    subtotal = models.IntegerField()
    id_carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name="items")
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="productos")

    def save(self, *args, **kwargs):
        # Auto-calcular subtotal (precio_unitario * cantidad)
        self.subtotal = self.precio_unitario * self.cantidad
        super(Items, self).save(*args, **kwargs)


class MetodoPago (models.Model):
    id_metodo_pago = models.AutoField(primary_key=True)
    nombre_metodo = models.CharField(max_length=50)

class transaccion (models.Model):
    id_transaccion = models.AutoField(primary_key=True)
    monto = models.IntegerField()
    fecha = models.DateField()
    id_metodo_pago = models.ForeignKey(MetodoPago, on_delete=models.CASCADE)

class Venta (models.Model):
    id_venta = models.AutoField(primary_key=True)
    fecha_venta = models.DateField()
    monto_total = models.IntegerField()
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    id_carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    metodo_pago = models.ForeignKey('MetodoPago', on_delete=models.SET_NULL, null=True)
    transaccion = models.ForeignKey('Transaccion', on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        # Validar que el carrito no esté asociado ya a otra venta
        if Venta.objects.filter(carrito=self.carrito).exists():
            raise ValueError("Este carrito ya está asociado a una venta.")
        super(Venta, self).save(*args, **kwargs)
