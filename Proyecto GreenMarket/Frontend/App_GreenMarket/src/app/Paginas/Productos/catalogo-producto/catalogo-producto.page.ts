import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { CarritoServiService } from 'src/app/Servicios/Carrito/carrito-servi.service';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service';
import { ToastController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-catalogo-producto',
  templateUrl: './catalogo-producto.page.html',
  styleUrls: ['./catalogo-producto.page.scss'],
})
export class CatalogoProductoPage implements OnInit {

  carrito: any[] = []; // Propiedad para almacenar el carrito
  productos: any[] = [];
  console: any;
  cartItemCount: number = 0;
  showSearchBar = false
  productosFiltrados: any[] = []

  constructor(private productoService: ProductoServiService,
              private serviciocarrito: CarritoServiService,
              private http: HttpClient,
              private toastController: ToastController, private router: Router) { }

  ngOnInit(): void {
    this.loadProductos();
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      // Aquí puedes actualizar los datos del carrito cuando la navegación termine
      this.loadProductos();
    });
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }
  onSearch(event: any) {
    const query = event.target.value.trim().toLowerCase();
    console.log('Buscando: ', query);
    if (query === '') {
        this.productosFiltrados = this.productos;
        return;
    }
    this.productosFiltrados = this.productos.filter((productos: any) => {
      return productos.nombre_producto.toLowerCase().includes(query);
    });
}

  loadProductos(): void {
    this.productoService.getProductos().subscribe(
      (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
      }
    );
  }

  agregarAlCarrito(productoId: number) {
    this.serviciocarrito.agregar_Carrito(productoId).subscribe(
      (response) => {
        // Mostrar mensaje de éxito
        this.mostrarMensaje(response.mensaje);
      },
      (error) => {
        // Mostrar mensaje de error
        this.mostrarMensaje('Error al agregar el producto al carrito');
      }
    );
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  private generateItems() {
    const count = this.productos.length + 1;
    for (let i = 0; i < 50; i++) {
      this.productos.push(`Item ${count + i}`);
    }
  }
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 100);
  }

}
