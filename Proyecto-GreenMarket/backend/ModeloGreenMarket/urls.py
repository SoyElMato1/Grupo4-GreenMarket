from django.urls import path
from .views import *

urlpatterns = [
    path('producto/', producto, name='producto'),
    path('carrito/', listar_carrito, name='carrito'),
    path('add/', agregar_carrito, name='agregar_producto'),
    path('categoria/', get_categoria, name='categoria'),
    path('provee/', Ver_proveedor, name='proveedor'),

]