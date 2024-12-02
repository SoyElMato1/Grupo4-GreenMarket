import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service'
@Component({
  selector: 'app-historial-compra',
  templateUrl: './historial-compra.page.html',
  styleUrls: ['./historial-compra.page.scss'],
})
export class HistorialCompraPage implements OnInit {
  orders: any[] = [];
  rut: string = '';
  contrasena: string = '';
  HistorialForm: FormGroup;  // Formulario reducido solo para RUT

  showPasswordHistorial: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private productoService: ProductoServiService,
  ) {
    this.HistorialForm = this.formBuilder.group({
      rut: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(8)]],
      contrasena: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  ngOnInit() {}

  togglePasswordVisibility(form: string) {
    if (form === 'vercontraseña') {
      this.showPasswordHistorial = !this.showPasswordHistorial;
    }
  }

  public campo(control: string) {
    return this.HistorialForm.get(control);
  }

  public campoTocado(control: string) {
    return this.HistorialForm.get(control)?.touched;
  }

  async verificarHistorial() {
    // Verificación de validez del formulario
    if (this.HistorialForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Ingrese un RUT válido.',
        duration: 2000,
        position: 'top',
      });
      toast.present();
      return;
    }

    // Aquí podrías llamar a un servicio para buscar el historial de compras según el RUT
    const rut = this.HistorialForm.value.username;
    console.log('Buscar historial de compras para RUT:', rut);

    // Navegación a la página de historial (ejemplo)
    this.router.navigate(['/historial-compras', { rut }]);
  }

  consultarHistorial(): void {
    if (this.rut || this.contrasena) {
      this.productoService.getHistorial(this.rut).subscribe({
        next: (data) => {
          this.orders = data;
          this.orders.forEach(order => {
            order.items.forEach((item: any) => {
              this.productoService.productoId(item.producto_id).subscribe({
                next: (producto) => item.nombre = producto.nombre_producto,
                error: (err) => console.error(`No se pudo obtener el producto con ID ${item.producto_id}`)
              });
            });
          });
        },
        error: (err) => console.error("Error al obtener el historial:", err)
      });
    }
  }
}
