import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/Servicios/Auth/authservice.service';
import { ProvedorServiService } from 'src/app/Servicios/Proveedor/provedor-servi.service'; // Importa el servicio
import { Proveedor } from 'src/app/Interfaces/proveedor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-panel-administrador',
  templateUrl: './panel-administrador.page.html',
  styleUrls: ['./panel-administrador.page.scss'],
})
export class PanelAdministradorPage implements OnInit {
  currentSection: string = 'dashboard'; // Sección por defecto

  proveedores: any[] = [];
  item: Proveedor = {
    rut: '',
    dv: '',
    correo_electronico: '',
    contrasena: '',
    nombre: '',
    apellido: ''
  };
  showCrudForm = false;
  registerForm: FormGroup;

  constructor(private authService: AuthserviceService, private proveedorService: ProvedorServiService,
    private router: Router, private toast: ToastController, private fb: FormBuilder,) {
    this.registerForm = this.fb.group({
      rut: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]], // RUT con 7 u 8 dígitos numéricos
      dv: ['', [Validators.required, Validators.pattern('^[0-9kK]{1}$')]], // DV de 1 dígito o 'k'
      correo_electronico: ['', [Validators.required, Validators.email]], // Correo electrónico válido
      contrasena: ['', [Validators.required, Validators.minLength(8)]], // Contraseña de al menos 8 caracteres
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]], // Solo letras para el nombre
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]], // Solo letras para el apellido
    });
  }

  ngOnInit() {
    this.loadProveedores();
  }

  // Cambiar la sección actual
  setSection(section: string) {
    this.currentSection = section;
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

  loadProveedores() {
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
    }, error => {
      console.error('Error al cargar proveedores', error);
    });
  }

  toggleCrudForm() {
    this.showCrudForm = !this.showCrudForm;
  }

  async onSubmit() {
    // Validamos que el formulario no esté vacío
    if (!this.item.rut || !this.item.dv || !this.item.correo_electronico || !this.item.contrasena || !this.item.nombre || !this.item.apellido) {
      const toast = await this.toast.create({
        message: 'Rellene los campos obligatorios',
        duration: 2000
      });
      toast.present();
      return;
    }

    // Llamamos al servicio para registrar el proveedor
    this.proveedorService.createProveedor(this.item).subscribe({
      next: async (response) => {
        console.log('Proveedor registrado exitosamente', response);

        // Añadimos el proveedor a la lista de proveedores
        this.proveedores.push(response);

        // Limpiamos el formulario
        this.resetForm();

        // Mostramos el mensaje de éxito
        const toast = await this.toast.create({
          message: 'Proveedor registrado correctamente',
          duration: 2000
        });
        toast.present();

        // // Redirigimos al dashboard o la página que prefieras
        // this.router.navigate(['/dashboard']);
      },
      error: async (error) => {
        console.error('Error al registrar proveedor', error);

        // Mostramos un mensaje de error en caso de fallo
        const toast = await this.toast.create({
          message: 'Error al registrar el proveedor. Intente nuevamente.',
          duration: 2000
        });
        toast.present();
      }
    });
  }

  resetForm() {
    this.item = {
      rut: '',
      dv: '',
      correo_electronico: '',
      contrasena: '',
      nombre: '',
      apellido: ''
    };
  }

  onEdit(selectedProveedor: Proveedor) {
    this.item = { ...selectedProveedor };
  }

  onDelete(selectedProveedor: Proveedor) {
    this.proveedorService.deleteProveedor(selectedProveedor.rut).subscribe(() => {
      this.proveedores = this.proveedores.filter(proveedor => proveedor !== selectedProveedor);
    }, error => {
      console.error('Error al eliminar el proveedor', error);
    });
  }

}
