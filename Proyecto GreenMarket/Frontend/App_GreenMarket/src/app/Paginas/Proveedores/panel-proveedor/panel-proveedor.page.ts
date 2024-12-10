import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthserviceService } from 'src/app/Servicios/Auth/authservice.service';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Asegúrate de que HttpHeaders esté aquí
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-panel-proveedor',
  templateUrl: './panel-proveedor.page.html',
  styleUrls: ['./panel-proveedor.page.scss'],
})
export class PanelProveedorPage implements OnInit {

  productoSeleccionado: number | null = null
  products: any[] = [];
  productoForm: FormGroup;
  editarForm: FormGroup;
  selectedImage: File | null = null
  isEditMode = false;

  categorias: any[] = [];
  currentSection: string = 'dashboard'; // Sección por defecto
  alertController: any;

  rutProveedor!: string | null;
  proveedor: any = {}; // Perfil del proveedor
  fotoSeleccionada: File | null = null; // Variable para almacenar el archivo de foto

  descripcion: string = '';

  constructor(private authService: AuthserviceService, private router: Router, private proService: ProductoServiService,
    private toast: ToastController, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef,
  ) {
    this.productoForm = this.formBuilder.group({
      nombre_producto: ['', [Validators.required,]],
      precio: [0, [Validators.required,]],
      imagen_producto: ['', [Validators.required,]],
      descripcion: ['', [Validators.required]],
      id_categoria: [0, [Validators.required]],
    })
    this.editarForm = this.formBuilder.group({
      nombre_producto: [''],
      precio: [0],
      imagen_producto: [''],
      descripcion: ['', [Validators.required]],
      id_categoria: [0],
      id_proveedor: ['']
    })
  }

  ngOnInit() {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      // Aquí puedes actualizar cuando la navegación termine
      this.loadPerfil();
      this.getProductos();
    });
    this.getCategorias();
    this.rutProveedor = localStorage.getItem('rut');
    if (this.rutProveedor) {
      this.getProductos();
    } else {
      console.error("No se encontró el RUT del proveedor en el localStorage");
    }
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
    formData.append('direccion',this.proveedor.direccion)
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
         // Recargar la página después de mostrar el mensaje
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Espera 2 segundos antes de recargar para permitir que el toast se muestre
      },
      (error) => {
        console.error('Error al actualizar el perfil', error);
      }
    );
  }

                                // Proveedor funciones
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

  // actualizarFoto(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     this.fotoSeleccionada = input.files[0];
  //   }
  // }

  // // Método para guardar cambios en el perfil, incluyendo la foto
  // actualizarPerfil() {
  //   const rut = localStorage.getItem('rut'); // Asegúrate de que esto esté definido
  //   const formData = new FormData();
  //   formData.append('nombre', this.proveedor.nombre);
  //   formData.append('apellido', this.proveedor.apellido);
  //   formData.append('correo_electronico', this.proveedor.correo_electronico);
  //   formData.append('direccion',this.proveedor.direccion)
  //   if (this.fotoSeleccionada) {
  //     formData.append('foto', this.fotoSeleccionada); // Adjunta la foto seleccionada
  //   }

  //   this.authService.actualizarPerfilProveedor(formData).subscribe(
  //     async (response) => {
  //       const toast = await this.toast.create({
  //         message: 'Perfil actualizado correctamente.',
  //         duration: 2000,
  //       });
  //       toast.present();
  //        // Recargar la página después de mostrar el mensaje
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 2000); // Espera 2 segundos antes de recargar para permitir que el toast se muestre
  //     },
  //     (error) => {
  //       console.error('Error al actualizar el perfil', error);
  //     }
  //   );
  // }

  // Cambiar la sección actual
  setSection(section: string) {
    this.currentSection = section;
  }

  /// Cosas de producto

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     this.selectedImage = input.files[0];
  //   }
  // }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result; // Aquí almacenamos la imagen como base64
      };
      reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
  }

  // Obtener productos del proveedor
  // Método para mostrar el toast
  async showToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  getProductos() {
    if (this.rutProveedor) {
      this.proService.getProductosByProveedor(this.rutProveedor).subscribe(data => {
        this.products = data;
      });
    } else {
      console.error('No se encontró el RUT del proveedor en el localStorage');
    }
  }

  async postProducto() {
    this.productoForm.value.imagen_producto = this.selectedImage;
    this.proService.agregarProducto(this.productoForm.value).subscribe(
      async response => {
        this.showToast('Producto agregado correctamente.');
        this.getProductos();
        this.productoForm.reset(); // Resetea los campos del formulario
        this.descripcion = ''; // Reinicia el contador de caracteres
        this.selectedImage = null; // Restablece la imagen seleccionada
      },
      async error => {
        console.error('Error al crear el producto:', error);
        await this.showToast('Error al agregar el producto.')
      }
    );
  }

  contarCaracteres() {
    // Actualiza la longitud de la descripción para mostrar el contador
    this.descripcion = this.productoForm.get('descripcion')?.value || '';
  }

  editar(productId: number) {
    this.isEditMode = !this.isEditMode
    this.productoSeleccionado = productId;
    this.proService.getProductoById(productId).subscribe(productData => {
      this.editarForm.patchValue({
        nombre_producto: productData.nombre,
        precio: productData.precio,
        id_categoria: productData.id_categoria,
        id_proveedor: productData.id_proveedor,
        imagen_producto: productData.imagen_producto,
        rut_proveedor: productData.id_proveedor,
        descripcion: productData.descripcion
    })
    console.log(productData);
      console.log(this.editarForm.value)
      this.cdr.detectChanges();
    });
  }

  desEditar() {
    this.productoSeleccionado = null;
    this.isEditMode = !this.isEditMode
  }

  putProducto(id: number) {
    if (this.selectedImage != null) {
      this.editarForm.value.imagen_producto = this.selectedImage;
    }
    console.log('Valores a modificar',this.editarForm.value)
    this.proService.modificarProducto(id, this.editarForm.value).subscribe(
      async response => {
        await this.showToast('Producto modificado correctamente.');
        this.getProductos();
      },
      async error => {
        console.error('Error al modificar el producto:', error);
        await this.showToast('Error al modificar el producto.');
      }
    );
    this.productoSeleccionado = null;
    this.isEditMode = !this.isEditMode
  }

  async eliminar(id_eliminar: number) {
    this.proService.eliminarProducto(id_eliminar).subscribe(
      async response => {
        await this.showToast('Producto eliminado correctamente.');
        this.getProductos();
      },
      async error => {
        console.error('Error al eliminar el producto:', error);
        await this.showToast('Error al eliminar el producto.');
      }
    );
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
