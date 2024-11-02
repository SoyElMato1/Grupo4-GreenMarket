import { Component, OnInit } from '@angular/core';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {

  producto: any;

  constructor( private route: ActivatedRoute, private productoService: ProductoServiService) { }

  ngOnInit() {
    const productoId = this.route.snapshot.paramMap.get('id');
    if (productoId) {
      this.cargarDetalleProducto(parseInt(productoId, 10));
    }
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
}
