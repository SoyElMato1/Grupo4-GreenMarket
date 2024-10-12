import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/Servicios/Auth/authservice.service';
import { ProvedorServiService } from 'src/app/Servicios/Proveedor/provedor-servi.service'; // Importa el servicio
import { Proveedor } from 'src/app/Interfaces/proveedor';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  username: string = '';
  password: string = '';

  proveedores: any[] = [];
  item = {
    rut: '',
    dv: '',
    correo_electronico: '',
    contrasena: '',
    nom_user: '',
    ap_user: '',
  };
  showCrudForm = false;
  showLoginForm = false;

  constructor(private router: Router, private authservice: AuthserviceService, private proveedorService: ProvedorServiService ) {}

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  login() {
    this.authservice.login(this.username, this.password).subscribe(
      (response: any) => {
        const token = response.token;  // Asegúrate de que tu respuesta incluya el token
        const userRole = response.user.rol; // Suponiendo que la respuesta incluye el rol
        const userData = {
          rol: userRole,
          // puedes agregar otros datos del usuario si es necesario
        };

        // Almacenar tanto el token como los datos del usuario en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user_data', JSON.stringify(userData));

        // Redireccionar según el rol
        if (userRole === 'admin') {
          this.router.navigate(['/panel-administrador']);
        } else if (userRole === 'proveedor') {
          this.router.navigate(['/panel-proveedor']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error('Error en el login', error);
      }
    );
  }

  // login() {
  //   this.authservice.login(this.username, this.password).subscribe(
  //     (response: any) => {
  //       // Aquí verificamos el rol y redirigimos
  //       const userRole = response.user.rol;

  //       if (userRole === 'admin') {
  //         this.router.navigate(['/panel-administrador']);  // Redirige al panel de admin
  //       } else if (userRole === 'proveedor') {
  //         this.router.navigate(['/panel-proveedor']);  // Redirige al panel de proveedor
  //       } else {
  //         this.router.navigate(['/home']);  // Redirige al home si el rol es diferente
  //       }
  //     },
  //     (error) => {
  //       console.error('Error en el login', error);
  //       // Manejar error de login, por ejemplo mostrando un mensaje
  //     }
  //   );
  // }


  toggleCrudForm() {
    this.showCrudForm = !this.showCrudForm;
  }

  onRegister() {
    this.authservice.registerProveedor(this.item).subscribe({
      next: (response) => {
        console.log('Proveedor registrado exitosamente', response);
        this.resetForm();
        // this.router.navigate(['/dashboard']); // Redirige al panel de administración
      },
      error: (error) => {
        console.error('Error al registrar proveedor', error);
      },
    });
  }

  resetForm() {
    this.item = {
      rut: '',
      dv: '',
      correo_electronico: '',
      contrasena: '',
      nom_user: '',
      ap_user: '',
    };
  }

}
