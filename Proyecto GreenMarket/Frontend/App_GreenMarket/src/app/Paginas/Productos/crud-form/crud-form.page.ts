import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Carrito } from 'src/app/Interfaces/carrito';
import { CarritoServiService } from 'src/app/Servicios/Carrito/carrito-servi.service';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.page.html',
  styleUrls: ['./crud-form.page.scss'],
})
export class CrudFormPage implements OnInit {

  cartItems: any[] = [];
  total = 0;
  customer = { rut: '', dv: '', correo_electronico: '', nombre: '', direccion: '' };
  mensaje: string = '';   // Mensaje para mostrar éxito o error
  public carrito!: Carrito;

  constructor(private router: Router, private cartService: CarritoServiService) {}

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

  ngOnInit() {
  }

  // Función para iniciar el pago

  calcularTotalCarrito() {
    let total = 0;

    // Verifica si los items existen antes de iterarlos
    if (this.carrito && Array.isArray(this.carrito.items)) {
      this.carrito.items.forEach((producto: any) => {
        total += producto.precio * producto.cantidad;
      });
    } else {
      console.error('El carrito no tiene items válidos:', this.carrito);
    }

    return total;
  }

  irAPagar() {
    this.cartService.iniciarPago({ total: this.total }).subscribe(
        response => {
            console.log(response);

            if (response.success) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = response.transaction_url;

                const tokenField = document.createElement('input');
                tokenField.type = 'hidden';
                tokenField.name = 'token_ws';
                tokenField.value = response.token;

                form.appendChild(tokenField);
                document.body.appendChild(form);

                form.submit(); // Redirige al usuario al formulario de pago de Transbank
            } else {
                alert('Error al iniciar pago: ' + response.message);
            }
        },
        error => {
            console.error(error);
            alert('Ocurrió un error al iniciar el pago.');
        }
    );
  }

}
