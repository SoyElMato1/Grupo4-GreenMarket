import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/Servicios/Auth/authservice.service';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-panel-proveedor',
  templateUrl: './panel-proveedor.page.html',
  styleUrls: ['./panel-proveedor.page.scss'],
})
export class PanelProveedorPage implements OnInit {

  products: any[] = [];
  currentSection: string = 'dashboard'; // Sección por defecto
  proveedor: any = {}; // Perfil del proveedor
  fotoSeleccionada: File | null = null; // Variable para almacenar el archivo de foto

  constructor(private authService: AuthserviceService, private router: Router, private proService: ProductoServiService,
    private toast: ToastController,
  ) { }

  ngOnInit() {
    this.loadPerfil();
  }

  loadPerfil() {
    this.authService.getProveedorPerfil().subscribe(
      (data) => {
        this.proveedor = data;
      },
      (error) => {
        console.error('Error al cargar el perfil', error);
      }
    );
  }

  actualizarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fotoSeleccionada = input.files[0];
    }
  }

  // Método para guardar cambios en el perfil, incluyendo la foto
  actualizarPerfil() {
    const formData = new FormData();
    formData.append('nombre', this.proveedor.nombre);
    formData.append('apellido', this.proveedor.apellido);
    formData.append('correo_electronico', this.proveedor.correo_electronico);
    if (this.fotoSeleccionada) {
      formData.append('foto', this.fotoSeleccionada); // Adjunta la foto seleccionada
    }

    this.authService.actualizarPerfil(formData).subscribe(
      async (response) => {
        const toast = await this.toast.create({
          message: 'Perfil actualizado correctamente.',
          duration: 2000,
        });
        toast.present();
      },
      (error) => {
        console.error('Error al actualizar el perfil', error);
      }
    );
  }

  // Cambiar la sección actual
  setSection(section: string) {
    this.currentSection = section;
  }

  loadProducts() {
    this.proService.getProductos().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products', error);
      }
    );
  }

  async onLogout() {
    const toast = await this.toast.create({
      message: 'Has cerrado sesión correctamente.',
      duration: 2000,
    });
    toast.present();

    // Aquí puedes realizar la lógica de cerrar sesión, como limpiar el token, etc.
    console.log('Cerrando sesión...');

    // Redirigimos al usuario a la página de login
    this.router.navigate(['/login']);
  }

}
