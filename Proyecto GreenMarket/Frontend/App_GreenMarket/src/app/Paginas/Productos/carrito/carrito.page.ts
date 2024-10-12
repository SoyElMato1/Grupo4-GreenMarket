import { Component, OnInit } from '@angular/core';
import { CarritoServiService } from '../../../Servicios/Carrito/carrito-servi.service';
import { Carrito } from 'src/app/Interfaces/carrito';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  cartItems: any[] = [];
  total = 0;
  customer = { rut: '', dv: '', correo_electronico: '', nombre: '', direccion: '' };
  mensaje: string = '';   // Mensaje para mostrar éxito o error
  public carrito!: Carrito;

  constructor(private cartService: CarritoServiService) { }

  ngOnInit() {
    this.loadCart();
    this.loadCustomerData();
  }

  loadCart() {
    this.cartService.ver_carrito().subscribe(
        (data) => {
            this.carrito = data; // Asigna los datos del carrito
            this.cartItems = data.items; // Asegúrate de que 'items' exista
            this.total = Number(data.total); // Usa 'total' aquí en vez de 'monto_total'

            // Logs para verificar los datos
            console.log('Carrito cargado:', this.carrito);
            console.log('Items del carrito:', this.cartItems);
            console.log('Total del carrito:', this.total);
        },
        (error) => {
            console.error('Error al cargar el carrito:', error);
        }
    );
  }

    // Función para cargar los datos del cliente desde local storage o API
  loadCustomerData() {
    const savedCustomer = localStorage.getItem('customerData');
    if (savedCustomer) {
      this.customer = JSON.parse(savedCustomer);
    }
  }

  // Función para eliminar un producto del carrito
  removeItem(productId: number) {
    this.cartService.restar_carrito(productId).subscribe(() => {
      this.loadCart();  // Volver a cargar el carrito después de eliminar un item
    });
  }

  // Función para realizar el checkout
  checkout() {
    const customer = {
      rut: this.customer.rut,
      dv: this.customer.dv,
      correo_electronico: this.customer.correo_electronico,
      nombre: this.customer.nombre,
      direccion: this.customer.direccion
    };

    const items = this.cartItems.map(item => ({
      producto_id: item.producto_id,
      cantidad: item.cantidad
    }));

    const checkoutData = {
      ...customer,
      items: items,
      total: this.total
    };

    const headers = { 'Content-Type': 'application/json' };
    this.cartService.checkout(checkoutData).subscribe(
      (response: any) => {
        if (response && response.orden_id) {
          this.mensaje = `Orden creada. ID de la orden: ${response.orden_id}`;
        } else {
          this.mensaje = 'Error: No se recibió el ID de la orden.';
        }
      },
      (error) => {
        console.error('Error al crear la orden', error);
        this.mensaje = 'Error al crear la orden. Inténtalo de nuevo.';
      }
    );
  }

}
