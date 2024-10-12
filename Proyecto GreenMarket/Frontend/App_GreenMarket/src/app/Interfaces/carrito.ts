import { Productoid } from './producto';

export interface ProductosEnCarrito {
  producto: Productoid;
  cantidad: number;
}

export interface Carrito {
  total: undefined;
  items: any;
  productos: any;
  id_carrito: number;
  cantidad: number;
  producto: Array<ProductosEnCarrito>;
  monto_total: number;
}
