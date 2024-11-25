import { Component, OnInit } from '@angular/core';
import { CarritoServiService } from '../../../Servicios/Carrito/carrito-servi.service';
import { Carrito } from 'src/app/Interfaces/carrito';
import { ToastController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Importa las clases necesarias

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  cartItems: any[] = [];
  total = 0;
  customer = { rut: '', dv: '', correo_electronico: '', contrasena: '', nombre: '', direccion: '' };
  mensaje: string = '';   // Mensaje para mostrar éxito o error
  public carrito!: Carrito;
  showClienteForm = false;
  // guardarCliente: boolean = false; // Esta es la propiedad que refleja el valor del checkbox
  showPasswordRegister: boolean = false;

  customerForm: FormGroup;

  togglePasswordVisibility(form: string) {
    if (form === 'register') {
      this.showPasswordRegister = !this.showPasswordRegister;
    }
  }

  constructor(private cartService: CarritoServiService,
              private toastController: ToastController,
              private router: Router, private fb: FormBuilder,) {
                this.customerForm = this.fb.group({
                  rut: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(8)]], // Solo números
                  dv: ['', [Validators.required, Validators.pattern('^[0-9Kk]{1}$')]], // Solo dígito verificador o K
                  correo_electronico: ['', [Validators.required, Validators.email]],
                  contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16),
                    Validators.pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)]],
                  nombre: ['', Validators.required, Validators.pattern('^[a-zA-ZñÑ]+$')],
                  direccion: ['', Validators.required]
                });
              }

  ngOnInit() {
    this.loadCart();
    this.loadCustomerData();
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      // Aquí puedes actualizar los datos del carrito cuando la navegación termine
      this.loadCart();
    });
  }

  precioUnitario (precio: number, cantidad: number): number{
    return precio * cantidad
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
      const customer = JSON.parse(savedCustomer);
      this.customerForm.patchValue(customer);  // Usa patchValue para cargar los datos
    }
  }

  toggleClienteForm() {
    if (this.showClienteForm) {
      this.resetClienteForm();
    }
    this.showClienteForm = !this.showClienteForm;
  }

  resetClienteForm() {
    this.customerForm.reset();
  }

  // Función para eliminar un producto del carrito
  removeItem(productId: number) {
    this.cartService.eliminar_carrito(productId).subscribe(() => {
      this.loadCart();  // Volver a cargar el carrito después de eliminar un item
    });
  }

  agregarItem(productId: number) {
    this.cartService.agregar_Carrito(productId).subscribe(() => {
      this.loadCart();  // Volver a cargar el carrito después de eliminar un item
    });
  }
  bajarItem(productId: number) {
    this.cartService.restar_carrito(productId).subscribe(() => {
      this.loadCart();  // Volver a cargar el carrito después de eliminar un item
    });
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

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000, // Duración en milisegundos
      position: 'top', // Posición del Toast
      color: 'dark' // Puedes cambiar el color según tu preferencia
    });
    await toast.present();
  }

  // buscar_cliente(rut: string) {
  //   if (!rut) return; // Si el RUT está vacío, no hacer nada

  //   this.cartService.cliente_obtener(rut).subscribe(
  //     (response: any) => {
  //       if (response) {
  //         // Usa patchValue para actualizar los campos específicos del formulario
  //         this.customerForm.patchValue({
  //           rut: rut, // El RUT generalmente no lo necesitarías modificar, pero se incluye aquí por si lo deseas
  //           dv: response.dv,
  //           correo_electronico: response.correo_electronico,
  //           contrasena: response.contrasena,
  //           nombre: response.nombre,
  //           direccion: response.direccion
  //         });

  //         // Si deseas que el cliente se registre después de cargar los datos, puedes hacerlo aquí
  //         this.showClienteForm = true; // Muestra el formulario si es necesario
  //         // this.guardarCliente = true;  // Marca para guardar los datos
  //       }
  //     },
  //     (error) => {
  //       console.error('Error al buscar el cliente:', error);
  //     }
  //   );
  // }

  buscar_cliente(rut: string) {
    if (!rut) return; // Si el RUT está vacío, no hacer nada
    this.cartService.cliente_obtener(rut ).subscribe(
      (response: any) => {
        if (response) {
          this.customer.dv = response.dv;
          this.customer.correo_electronico = response.correo_electronico;
          // this.customer.contrasena = response.contrasena
          this.customer.nombre = response.nombre;
          this.customer.direccion = response.direccion;
        }
      },
    );
  }

  // guardar_cliente(){
  //   this.cartService.crearCliente(this.customer).subscribe(
  //     (response) => {
  //       console.log('Cliente creado exitosamente', response);
  //     },
  //   );
  // }

  validateForm(): boolean {
    if (this.customerForm.invalid) {
      this.mostrarToast('Por favor, completa el formulario correctamente.');
      return false;
    }
    return true;
  }


// checkout_pago() {
//   // Verificar si el carrito tiene productos y si el formulario es válido
//   if (this.cartItems.length === 0) {
//     this.mostrarToast('El carrito está vacío. Agrega productos antes de proceder al pago.');
//     return;
//   }

//   if (!this.validateForm()) {
//     this.mostrarToast('Completa el formulario antes de seguir.');
//     return;
//   }

//   // Crear los datos para el checkout
//   const items = this.cartItems.map(item => ({
//     producto_id: item.producto_id,
//     cantidad: item.cantidad
//   }));

//   const checkoutData = {
//     rut: this.customer.rut,
//     dv: this.customer.dv,
//     correo_electronico: this.customer.correo_electronico,
//     nombre: this.customer.nombre,
//     direccion: this.customer.direccion,
//     items: items,
//     total: this.total
//   };

//   // Realizar el checkout y crear la orden
//   this.cartService.checkout(checkoutData).subscribe(
//     (response: any) => {
//       if (response && response.orden_id) {
//         this.mostrarToast(`Orden creada. ID de la orden: ${response.orden_id}`);
//         // Aquí puedes continuar con el proceso de pago
//       } else {
//         this.mostrarToast('Error: No se recibió el ID de la orden.');
//       }
//     },
//     (error) => {
//       console.error('Error al crear la orden', error);
//       this.mostrarToast('Error al crear la orden. Inténtalo de nuevo.');
//     }
//   );
// }


//   irAPagar() {
//     if (!this.customer.rut || !this.customer.dv || !this.customer.correo_electronico || !this.customer.nombre || !this.customer.direccion) {
//           this.mostrarToast('Por favor, completa todos los campos.');
//           return;
//         }
//     this.cartService.iniciarPago({ total: this.total }).subscribe(
//         response => {
//             console.log(response);

//             if (response.success) {
//                 const form = document.createElement('form');
//                 form.method = 'POST';
//                 form.action = response.transaction_url;

//                 const tokenField = document.createElement('input');
//                 tokenField.type = 'hidden';
//                 tokenField.name = 'token_ws';
//                 tokenField.value = response.token;

//                 form.appendChild(tokenField);
//                 document.body.appendChild(form);

//                 form.submit(); // Redirige al usuario al formulario de pago de Transbank
//             } else {
//                 alert('Error al iniciar pago: ' + response.message);
//             }
//         },
//         error => {
//             console.error(error);
//             alert('Ocurrió un error al iniciar el pago.');
//         }
//     );
//   }

checkout_pago() {
  // Verificar si el carrito tiene productos y si el formulario es válido
  if (this.cartItems.length === 0) {
    this.mostrarToast('El carrito está vacío. Agrega productos antes de proceder al pago.');
    return;
  }

  if (!this.validateForm()) {
    this.mostrarToast('Completa el formulario antes de seguir.');
    return;
  }

  // Crear los datos para el checkout
  const items = this.cartItems.map(item => ({
    producto_id: item.producto_id,
    cantidad: item.cantidad
  }));

  const checkoutData = this.customerForm.value;

  const checkoutPayload = {
    ...checkoutData,
    items,
    total: this.total
  };

  // const checkoutData = {
  //   rut: this.customer.rut,
  //   dv: this.customer.dv,
  //   correo_electronico: this.customer.correo_electronico,
  //   nombre: this.customer.nombre,
  //   direccion: this.customer.direccion,
  //   items: items,
  //   total: this.total
  // };

  // Realizar el checkout y crear la orden
  this.cartService.checkout(checkoutPayload).subscribe(
    (response: any) => {
      if (response && response.orden_id) {
        this.mostrarToast(`Orden creada. ID de la orden: ${response.orden_id}`);
        this.irAPagar(response.orden_id); // Llama a irAPagar después de crear la orden
      } else {
        this.mostrarToast('Error: No se recibió el ID de la orden.');
      }
    },
    (error) => {
      console.error('Error al crear la orden', error);
      this.mostrarToast('Error al crear la orden. Inténtalo de nuevo.');
    }
  );
}

irAPagar(orden_id: any) {
  if (!this.validateForm()) {
    this.mostrarToast('Por favor, completa todos los campos.');
    return;
  }

  this.cartService.iniciarPago({ total: this.total,orden_id : orden_id }).subscribe(
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
