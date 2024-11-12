import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CarritoServiService} from './../app/Servicios/Carrito/carrito-servi.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showHeader: boolean = true;
  cantidadCarrito: number = 0;

  isDropdownVisible: boolean = false
  constructor(private router: Router,
              private carritoService: CarritoServiService
  ) {
    // Se suscribe a los cambios de ruta
    this.router.events.subscribe(() => {
      this.toggleHeader();
    });
  }

  toggleHeader() {
    // Cambiar esta lógica según las rutas donde no quieras mostrar el header
    const currentUrl = this.router.url;
    this.showHeader = !['/panel-proveedor'].includes(currentUrl); // Oculta el header en las rutas '/login' y '/registro'
  }
  // ngOnInit() {
  //   this.carritoService.getCartItemCount$.subscribe((count) => {
  //     this.cartCount = count;
  //   });

  ngOnInit() {
    // Escucha los cambios de cantidadCarrito desde el servicio
    this.cantidadCarrito = this.carritoService.obtenerCantidadCarrito();
    this.carritoService.cantidadCarrito.subscribe(cantidad => {
      this.cantidadCarrito = cantidad;
    });

  }

}
