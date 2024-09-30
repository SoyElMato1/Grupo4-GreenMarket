import { Categoria } from './categoria';

export interface Producto {
  nombre_producto: string;
  precio: number;
  imagen: string;
  categoria: Categoria;
}

export interface Productoid extends Producto {
  id_producto: number;
}
