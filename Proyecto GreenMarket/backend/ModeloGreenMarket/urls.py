from django.urls import path
from .views import *
from .views_carrito import *
from .views_transbank import *
from .views_login import *
from .views_producto import *


urlpatterns = [
# Views Categoria
    path('categoria/', get_categoria, name='categoria'),
    path('Filtrar/', Filtrar_categoria, name='Filtrar_categoria'),

# Views Producto
    path('producto/', producto, name='producto'),
    path('agregarPro/', agregar_productos, name='producto añadido'),
    path('obtener_producto/<int:id>/', obtener_producto, name='obtener_producto'),

    path('productos/', obtener_productos, name='obtener_productos'),
    path('producto/<int:id>/', producto_proveedor, name='obtener_producto'),
    path('agreproducto/', agregar_producto, name='producto añadido'),
    path('productos/<int:id>/', actualizar_eliminar_producto, name='actualizar_eliminar_producto'),

#Proveedor
    path('provee/', Ver_proveedor, name='proveedor'),
    path('proveedores/<int:id>/', proveedor_detalle, name='proveedor_detalle'),
    path('proveedores_por_producto/', proveedores_por_producto, name='proveedores_por_producto'),
    path('historialVenta/<str:rut>/', historial_ventas, name='historial_proveedor'),

# Carrito
    path('agregar/<int:producto_id>/', agregar_al_carrito, name='agregar_al_carrito'),
    path('agregar_bot/', agregar_al_carrito_bot, name='agregar_al_carrito_bot'),
    path('restar/<int:producto_id>/', restar_producto, name='restar producto'),
    path('limpiar/', limpiar_carrito, name= 'limpiar_carrito'),
    path('carrito/', ver_carrito, name='ver_carrito'),
    path('crear_oden/', checkout, name='checkout'),
    path('eliminar/<int:producto_id>/', eliminar_del_carrito, name='eliminar del carrito'),

# Cliente
    path('cliente/<int:rut>', cliente_obtener, name='cliente_obtener'),
    path('clienteAgre/', guardar_cliente, name='guardar_cliente'),
    path('historial/<str:rut>/', historial_compras, name='historial_compras'),

# Transbank
    path('pago/iniciar/', iniciar_pago, name='iniciar_pago'),
    path('validar_pago/', validar_pago, name='validar_pago'),
    path('pago_exitoso/', pago_exitoso, name='pago_exitoso'),
    path('pago_fallido/', pago_fallido, name='pago_fallido'),
    path('detalles-pago-exitoso/', detalles_pago_exitoso, name='detalles_pago_exitoso'),

#Login 
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('registro_proveedor/', register_proveedor_view, name='registro proveedor'),
    path('verify_2fa_code/', verify_2fa_code, name='verify_2fa_code'),
    path('request_password/', request_password, name='request_password'),
    path('reset_password/', reset_password, name='reset_password'),

#bot
    path('analizar_imagen/', analizar_imagen, name='analizar_imagen'),
    path('api/chat/upload', upload_image, name='upload_image'),
]