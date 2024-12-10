import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CarritoServiService } from './../app/Servicios/Carrito/carrito-servi.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showHeader: boolean = true;
  cantidadCarrito: number = 0;
  isDropdownVisible: boolean = false;

  constructor(
    private router: Router,
    private carritoService: CarritoServiService,
    private menuCtrl: MenuController // Importamos el controlador del menú
  ) {
    // Se suscribe a los cambios de ruta
    this.router.events.subscribe(() => {
      this.toggleHeader();
    });
  }

  ngOnInit() {
    // Escucha los cambios de cantidadCarrito desde el servicio
    this.cantidadCarrito = this.carritoService.obtenerCantidadCarrito();
    this.carritoService.cantidadCarrito.subscribe((cantidad) => {
      this.cantidadCarrito = cantidad;
    });
  }

  // toggleHeader() {
  //   // Cambiar esta lógica según las rutas donde no quieras mostrar el header
  //   const currentUrl = this.router.url;
  //   this.showHeader = !['/panel-proveedor'].includes(currentUrl);
  // }

  toggleHeader() {
    // Cambiar esta lógica según las rutas donde no quieras mostrar el header
    const currentUrl = this.router.url;

    // Ocultar el header en estas rutas
    const hideHeaderRoutes = ['/panel-proveedor', '/panel-administrador'];
    this.showHeader = !hideHeaderRoutes.includes(currentUrl);
  }

  // Cierra el menú cuando se selecciona una opción
  async closeMenu() {
    await this.menuCtrl.close('first'); // 'first' es el menuId que configuramos en el HTML
  }
}
