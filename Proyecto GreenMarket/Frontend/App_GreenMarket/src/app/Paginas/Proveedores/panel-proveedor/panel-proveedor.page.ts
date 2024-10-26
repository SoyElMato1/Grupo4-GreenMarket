import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from 'src/app/Servicios/Auth/authservice.service';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Asegúrate de que HttpHeaders esté aquí
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-panel-proveedor',
  templateUrl: './panel-proveedor.page.html',
  styleUrls: ['./panel-proveedor.page.scss'],
})
export class PanelProveedorPage implements OnInit {

  products: any[] = [];
  rutProveedor!: string | null;
  nuevoProducto = {
    nombre_producto: '',
    precio: null,
    imagen_producto: '',
    id_categoria: null, // ID de categoría, a configurar
  };
  categorias: any[] = [];
  isEditMode = false;
  currentSection: string = 'dashboard'; // Sección por defecto
  proveedor: any = {}; // Perfil del proveedor
  fotoSeleccionada: File | null = null; // Variable para almacenar el archivo de foto
  alertController: any;

  constructor(private authService: AuthserviceService, private router: Router, private proService: ProductoServiService,
    private toast: ToastController,
  ) { }

  ngOnInit() {
    // this.loadPerfil();
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      // Aquí puedes actualizar los datos del carrito cuando la navegación termine
      this.loadPerfil();
    });
    this.getCategorias();
    this.rutProveedor = localStorage.getItem('rut');
    if (this.rutProveedor) {
      this.getProductos();
    } else {
      console.error("No se encontró el RUT del proveedor en el localStorage");
    }
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
    const rut = localStorage.getItem('rut'); // Asegúrate de que esto esté definido
    const formData = new FormData();
    formData.append('nombre', this.proveedor.nombre);
    formData.append('apellido', this.proveedor.apellido);
    formData.append('correo_electronico', this.proveedor.correo_electronico);
    if (this.fotoSeleccionada) {
      formData.append('foto', this.fotoSeleccionada); // Adjunta la foto seleccionada
    }

    this.authService.actualizarPerfilProveedor(formData).subscribe(
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

  // Obtener productos del proveedor
  getProductos() {
    if (this.rutProveedor) {
      this.proService.getProductosByProveedor(this.rutProveedor).subscribe(data => {
        this.products = data;
      });
    } else {
      console.error('No se encontró el RUT del proveedor en el localStorage');
    }
  }

  getCategorias(){
    this.proService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }



  async onLogout() {
    // Primero, realizamos la llamada al backend para cerrar sesión
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`  // O 'Bearer' si usas JWT
    });

    this.authService.logout(headers).subscribe(
        async (response) => {
            // Mostrar mensaje de éxito
            const toast = await this.toast.create({
                message: 'Has cerrado sesión correctamente.',
                duration: 2000,
            });
            toast.present();

            // Limpiar el almacenamiento local
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('user_data');
            localStorage.removeItem('rut');

            // Redirigir al usuario a la página de login
            this.router.navigate(['/login']);
        },
        async (error) => {
            console.error('Error al cerrar sesión:', error);
            // Manejar el error si es necesario
            const toast = await this.toast.create({
                message: 'Error al cerrar sesión. Intenta de nuevo.',
                duration: 2000,
            });
            toast.present();
        }
    );
  }

}
