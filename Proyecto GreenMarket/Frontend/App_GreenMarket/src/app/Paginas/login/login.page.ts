import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/Servicios/Auth/authservice.service';
import { ProvedorServiService } from 'src/app/Servicios/Proveedor/provedor-servi.service'; // Importa el servicio
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

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
  showCrudForm = true;
  showLoginForm = false;

  loginForm: FormGroup;
  registerForm: FormGroup;

  showPasswordLogin: boolean = false;
  showPasswordRegister: boolean = false;

  handleButtonClick() {
    this.toggleCrudForm();
    this.toggleLoginForm();
  }

  togglePasswordVisibility(form: string) {
    if (form === 'login') {
      this.showPasswordLogin = !this.showPasswordLogin;
    } else if (form === 'register') {
      this.showPasswordRegister = !this.showPasswordRegister;
    }
  }

  constructor(private router: Router, private authservice: AuthserviceService, private proveedorService: ProvedorServiService,
    private formBuilder: FormBuilder, private toast: ToastController) {
      this.loginForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      });
      this.registerForm = this.formBuilder.group({
        rut: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(8)]], // Solo números
        dv: ['', [Validators.required, Validators.pattern('^[0-9Kk]{1}$')]], // Solo dígito verificador o K
        correo_electronico: ['', [Validators.required, Validators.email]], // Correo electrónico válido
        contrasena: ['', [Validators.required, Validators.minLength(8)]], // Contraseña mínima de 8 caracteres
        nom_user: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑ]+$')]], // Letras con "ñ" y "Ñ" permitidas
        ap_user: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑ]+$')]], // Letras con "ñ" y "Ñ" permitidas
    });
  }

  ngOnInit() {}

  public campo(control: string){
    return this.loginForm.get(control);
  }
  public campoTocado(control: string){
    return this.loginForm.get(control)?.touched;
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    if (!this.showLoginForm) {
      this.loginForm.reset();
      this.loginForm.updateValueAndValidity();
    }
  }

  async login() {
    // Validar formulario de login
    if (this.loginForm.invalid) {
      const toast = await this.toast.create({
        message: 'Rellene los campos',
        position: 'top',
        duration: 2000
      });
      toast.present();
      return;
    }

    // Extraer valores de username y password desde el formulario
    const { username, password } = this.loginForm.value;

    // Llamar al servicio de autenticación con los valores
    this.authservice.login(username, password).subscribe(
      async (response: any) => {
        if (response) {
          const token = response.token; // Asegúrate de que la respuesta incluya el token
          const userRole = response.user.rol; // Suponiendo que la respuesta incluye el rol del usuario
          const userData = {
            rol: userRole,
            // Puedes agregar otros datos del usuario si es necesario
          };

          // Almacenar tanto el token como los datos del usuario en localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('user_data', JSON.stringify(userData));

          // Mostrar mensaje de bienvenida
          const toast = await this.toast.create({
            header: 'Bienvenido Usuario',
            position: 'top',
            duration: 2000
          });
          await toast.present();

          // Redireccionar según el rol del usuario
          if (userRole === 'admin') {
            this.router.navigate(['/panel-administrador']);
          } else if (userRole === 'proveedor') {
            this.router.navigate(['/panel-proveedor']);
          } else {
            this.router.navigate(['/home']);
          }

          // Limpiar el formulario
          this.loginForm.reset();
          this.loginForm.updateValueAndValidity();
        }
      },
      async (error) => {
        console.error('Error en el login', error);
        const toast = await this.toast.create({
          message: 'Error en el inicio de sesión',
          position: 'top',
          duration: 2000
        });
        toast.present();
      }
    );
  }

  toggleCrudForm() {
    this.showCrudForm = !this.showCrudForm;
    if (!this.showCrudForm) {
      this.registerForm.reset();
      this.registerForm.updateValueAndValidity();
    }
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      const toast = await this.toast.create({
        message: 'Rellene los campos',
        position: 'top',
        duration: 2000
      });
      toast.present();
      return;
    }

    // Usamos el servicio de proveedor en lugar del de usuario
    this.authservice.registerProveedor(this.registerForm.value).subscribe({
      next: async (response) => {
        console.log('Proveedor registrado exitosamente', response);

        // Limpiamos el formulario y actualizamos su validez
        this.registerForm.reset();
        this.registerForm.updateValueAndValidity();

        // Mostramos el mensaje de éxito
        const toast = await this.toast.create({
          message: 'Proveedor registrado correctamente',
          position: 'top',
          duration: 2000
        });
        toast.present();

        // Redirigimos a otra página, como la página principal o dashboard
        // this.router.navigate(['/dashboard']);
      },
      // error: async (error) => {
      //   console.error('Error al registrar proveedor', error);

      //   // Mostramos un mensaje de error en caso de fallo
      //   const toast = await this.toast.create({
      //     message: 'Error al registrar el proveedor. Intente nuevamente.',
      //     position: 'top',
      //     duration: 2000
      //   });
      //   toast.present();
      // }
    });
  }

}
