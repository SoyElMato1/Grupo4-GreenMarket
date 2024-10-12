import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/Servicios/Auth/authservice.service';
import { ProvedorServiService } from 'src/app/Servicios/Proveedor/provedor-servi.service'; // Importa el servicio
import { Proveedor } from 'src/app/Interfaces/proveedor';


@Component({
  selector: 'app-panel-administrador',
  templateUrl: './panel-administrador.page.html',
  styleUrls: ['./panel-administrador.page.scss'],
})
export class PanelAdministradorPage implements OnInit {

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

  constructor(private authService: AuthserviceService,
              private proveedorService: ProvedorServiService,
              private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']); // Redirigir a la página de inicio de sesión
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

  onSubmit() {
    if (this.item.rut && this.item.dv && this.item.correo_electronico && this.item.contrasena && this.item.nombre && this.item.apellido) {
      this.proveedorService.createProveedor(this.item).subscribe(response => {
        this.proveedores.push(response);
        this.resetForm();
      }, error => {
        console.error('Error al registrar el proveedor', error);
      });
    }
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
