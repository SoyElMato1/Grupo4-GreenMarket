import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pago-fallido',
  templateUrl: './pago-fallido.component.html',
  styleUrls: ['./pago-fallido.component.scss']
})
export class PagoFallidoComponent implements OnInit {
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.message = params['message'] || 'El pago fue cancelado o fallido. Inténtalo de nuevo.';
    });
  }

  irAInicio(): void {
    this.router.navigate(['/']); // Redirige a la ruta de inicio
  }
}



