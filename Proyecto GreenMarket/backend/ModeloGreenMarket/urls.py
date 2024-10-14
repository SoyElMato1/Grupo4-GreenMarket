from django.urls import path
from .views import *
from .views_carrito import *

urlpatterns = [
    path('producto/', producto, name='producto'),
    path('agregarPro/', agregar_producto, name='producto añadido'),
    path('categoria/', get_categoria, name='categoria'),
    path('provee/', Ver_proveedor, name='proveedor'),
    path('provee/<id>', detalle_proveedor, name='detalle_proveedores'),

# Carrito
    path('agregar/<int:producto_id>/', agregar_al_carrito, name='agregar_al_carrito'),
    path('restar/<int:producto_id>/', restar_producto, name='restar producto'),
    path('limpiar/', limpiar_carrito, name= 'limpiar_carrito'),
    path('carrito/', ver_carrito, name='ver_carrito'),
    path('checkout/', checkout, name='checkout'),

# Transbank
    path('pago/iniciar/', iniciar_pago, name='iniciar_pago'),
    path('pago_exitoso/', pago_exitoso, name='pago_exitoso'),
    path('pago_fallido/', pago_fallido, name='pago_fallido'),

#Login 
    path('login/', login_view, name='admin_login'),
    path('logout/', logout_view, name='logout'),
    path('registro_proveedor/', register_proveedor_view, name='registro proveedor')
]