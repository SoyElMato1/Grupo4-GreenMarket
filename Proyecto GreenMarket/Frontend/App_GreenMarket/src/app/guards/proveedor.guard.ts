import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthserviceService } from '../Servicios/Auth/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorGuard implements CanActivate {

  constructor(private authService: AuthserviceService, private router: Router) {}

  canActivate(): boolean {
    const role = this.getUserRole();

    if (role === 'proveedor') {
      return true; // Permitir acceso
    } else {
      this.router.navigate(['/']); // Redirigir a la página de inicio si no es admin
      return false; // Bloquear acceso
    }
  }

  getUserRole(): string | null {
    const user = JSON.parse(localStorage.getItem('user_data')!);
    return user ? user.rol : null;
  }
}
