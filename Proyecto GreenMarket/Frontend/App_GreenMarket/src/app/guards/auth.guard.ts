import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthserviceService } from '../Servicios/Auth/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthserviceService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      return true;  // Si el token existe, permite el acceso
    } else {
      this.router.navigate(['/login']);  // Redirige a la página de login si no hay token
      return false;
    }
  }
}
