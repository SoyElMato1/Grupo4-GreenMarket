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

  constructor(private authService: AuthserviceService, private router: Router, private proService: ProductoServiService,
    private toast: ToastController,
  ) { }

  ngOnInit() {
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
