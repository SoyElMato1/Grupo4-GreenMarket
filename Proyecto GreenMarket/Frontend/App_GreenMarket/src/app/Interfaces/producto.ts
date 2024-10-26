import { Categoria } from './categoria';
import { Proveedor } from './proveedor';

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  imagen_producto: string;
  id_categoria: Categoria | null;
  id_proveedor?: Proveedor; // Cambiado a opcional
}

export interface Productoid extends Producto {
  id_producto: number;
}
