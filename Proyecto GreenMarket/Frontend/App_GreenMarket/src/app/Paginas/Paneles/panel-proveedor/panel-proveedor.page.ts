import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/Servicios/Auth/authservice.service';

@Component({
  selector: 'app-panel-proveedor',
  templateUrl: './panel-proveedor.page.html',
  styleUrls: ['./panel-proveedor.page.scss'],
})
export class PanelProveedorPage implements OnInit {

  constructor(private authService: AuthserviceService, private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']); // Redirigir a la página de inicio de sesión
  }

}
