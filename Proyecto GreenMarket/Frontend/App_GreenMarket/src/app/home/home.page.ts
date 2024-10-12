import { Component, OnInit } from '@angular/core';
import { CarritoServiService } from '../Servicios/Carrito/carrito-servi.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  cartItemCount: number = 0;

  constructor(private cartService: CarritoServiService,
              private router : Router,
              private http : HttpClient) {}

  lista_de_provedores(){
    this.router.navigate(['/proveedor'])
  }

  ngOnInit() {
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Redirigir a la página de login
  }

}
