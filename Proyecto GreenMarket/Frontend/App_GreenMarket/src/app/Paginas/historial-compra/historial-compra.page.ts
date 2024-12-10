import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service';

@Component({
  selector: 'app-historial-compra',
  templateUrl: './historial-compra.page.html',
  styleUrls: ['./historial-compra.page.scss'],
})
export class HistorialCompraPage implements OnInit {
  orders: any[] = [];
  rut: string = '';
  contrasena: string = '';
  HistorialForm: FormGroup; // Formulario reducido solo para RUT
  showPasswordHistorial: boolean = false;
  cargando: boolean = false; // Para mostrar un spinner mientras se carga el historial

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private productoService: ProductoServiService
  ) {
    this.HistorialForm = this.formBuilder.group({
      rut: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(7),
          Validators.maxLength(8),
        ],
      ],
      contrasena: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(12)],
      ],
    });
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPasswordHistorial = !this.showPasswordHistorial;
  }

  public campo(control: string) {
    return this.HistorialForm.get(control);
  }

  public campoTocado(control: string) {
    return this.HistorialForm.get(control)?.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.HistorialForm.get(controlName);
    if (control?.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.hasError('minlength'))
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres.`;
    if (control?.hasError('maxlength'))
      return `Debe tener máximo ${control.errors?.['maxlength'].requiredLength} caracteres.`;
    if (control?.hasError('pattern')) return 'Formato no válido.';
    return '';
  }

  async verificarHistorial() {
    // Verificación de validez del formulario
    if (this.HistorialForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Por favor, revise los campos ingresados.',
        duration: 2000,
        position: 'top',
      });
      toast.present();
      return;
    }

    const rut = this.HistorialForm.value.rut;
    console.log('Buscar historial de compras para RUT:', rut);

    // Ejemplo de navegación a la página de historial
    this.router.navigate(['/historial-compras', { rut }]);
  }

  consultarHistorial(): void {
    if (this.HistorialForm.invalid) {
      this.presentToast('Por favor ingrese un RUT válido.');
      return;
    }

    this.rut = this.HistorialForm.value.rut;
    this.cargando = true;

    this.productoService.getHistorial(this.rut).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.presentToast('No se encontraron registros en el historial.');
        }
        this.orders = data;
        this.orders.forEach((order) => {
          order.items.forEach((item: any) => {
            this.productoService.productoId(item.producto_id).subscribe({
              next: (producto) =>
                (item.nombre = producto.nombre_producto),
              error: (err) =>
                console.error(
                  `No se pudo obtener el producto con ID ${item.producto_id}`
                ),
            });
          });
        });
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.presentToast('Error al obtener el historial.');
        console.error('Error al obtener el historial:', err);
      },
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
