import { Categoria } from './categoria';
import { Proveedor } from './proveedor';

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  imagen_producto: string;
  categoria: Categoria;
  id_proveedor: Proveedor;
}

export interface Productoid extends Producto {
  id_producto: number;
}
