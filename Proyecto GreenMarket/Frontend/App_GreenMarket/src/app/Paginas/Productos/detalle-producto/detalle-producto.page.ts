import { Component, OnInit } from '@angular/core';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service';
import { ActivatedRoute } from '@angular/router';
import { CarritoServiService } from 'src/app/Servicios/Carrito/carrito-servi.service';
import { ToastController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {

  producto: any;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoServiService,
    private serviciocarrito: CarritoServiService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    const productoId = this.route.snapshot.paramMap.get('id');
    if (productoId) {
      this.cargarDetalleProducto(parseInt(productoId, 10));
    }
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  cargarDetalleProducto(id: number) {
    this.productoService.getdetalleProducto(id).subscribe(
      (data) => {
        this.producto = data;
      },
      (error) => {
        console.error('Error al cargar el detalle del producto:', error);
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

}
