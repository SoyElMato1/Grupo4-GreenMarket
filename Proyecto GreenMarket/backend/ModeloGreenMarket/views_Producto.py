from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer
from rest_framework.response import Response
from rest_framework import status

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # Establece el proveedor que está logueado
        data['id_proveedor'] = request.user.proveedor.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        proveedor_id = request.query_params.get('proveedor_id')
        queryset = Producto.objects.filter(id_proveedor=proveedor_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
