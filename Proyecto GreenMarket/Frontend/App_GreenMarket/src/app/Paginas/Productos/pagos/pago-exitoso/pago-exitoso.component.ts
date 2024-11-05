import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoServiService } from '../../../../Servicios/Carrito/carrito-servi.service';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html',
  styleUrls: ['./pago-exitoso.component.scss']
})
export class PagoExitosoComponent implements OnInit {

  transaccionData: any; // Almacena los detalles de la transacción
  order: string | null = null;
  token: string | null = null;  // Verifica que esta línea esté presente y correcta

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoServiService
  ) {}

  ngOnInit() {
    // Obtener el buy_order desde los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.order = params['order'];
      if (this.order) {
        // Llama al servicio para obtener los detalles de la transacción
        this.carritoService.obtenerDetallesPagoExitoso(this.order).subscribe(
          (response) => {
            if (response.success) {
              this.transaccionData = response.data;
            } else {
              console.error('Error al obtener los detalles de la transacción:', response.message);
            }
          },
          (error) => {
            console.error('Error en la solicitud:', error);
          }
        );
      }
    });
  }
}
