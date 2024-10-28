import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html',
  styleUrls: ['./pago-exitoso.component.scss']
})
export class PagoExitosoComponent implements OnInit {

  token: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el token_ws desde los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token_ws'];
      if (this.token) {
        // Aquí puedes hacer una solicitud al backend para confirmar la transacción
        console.log('Pago exitoso con token:', this.token);
      }
    });
  }
}

