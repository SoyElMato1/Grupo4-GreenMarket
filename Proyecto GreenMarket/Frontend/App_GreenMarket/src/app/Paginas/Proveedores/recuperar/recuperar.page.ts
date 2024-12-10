import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../Servicios/Auth/authservice.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})

export class RecuperarPage implements OnInit {
  token: string = '';
  resetForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthserviceService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router
  ) {
    // Inicializar el formulario
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    // Obtener el token de la URL
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        this.showToast('Token no encontrado en la URL.', 'danger');
        this.router.navigate(['/login']); // Redirigir al login si no hay token
      }
    });
  }

  // Manejar el envío del formulario
  async onSubmit() {
    if (this.resetForm.invalid) {
      this.showToast('La contraseña debe tener al menos 8 caracteres.', 'warning');
      return;
    }

    const { password } = this.resetForm.value;

    this.authService.updatePassword(this.token, password).subscribe({
      next: async () => {
        this.showToast('Contraseña actualizada correctamente.', 'success');
        this.router.navigate(['/login']);
      },
      error: async (error) => {
        console.error('Error al actualizar la contraseña:', error);
        this.showToast('Error al actualizar la contraseña.', 'danger');
      },
    });
  }

  // Método para mostrar mensajes Toast
  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color, // Agrega color para diferenciar mensajes
    });
    await toast.present();
  }
  togglePasswordVisibility() {
    const input = document.querySelector('ion-input[type="password"]') as HTMLIonInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }
}
