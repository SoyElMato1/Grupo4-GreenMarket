import { Component, OnInit } from '@angular/core';
import { CarritoServiService } from '../Servicios/Carrito/carrito-servi.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  cartItemCount: number = 0;
  currentIndex: number = 0;
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




  // Lista de imágenes
  images: string[] = [
    'path/to/your/image1.jpg',
    'path/to/your/image2.jpg',
    'path/to/your/image3.jpg',
  ];

  // Función para mostrar la imagen siguiente
  nextSlide() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Regresar a la primera imagen si estamos en la última
    }
  }

  // Función para mostrar la imagen anterior
  previousSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1; // Regresar a la última imagen si estamos en la primera
    }
  }
  //supuesto carusel
  // ngAfterViewInit() {
  //   const myCarousel = document.querySelector('#myCarousel');
  //   if (myCarousel) {
  //     new bootstrap.Carousel(myCarousel, {
  //       interval: 3000
  //     });
  //   }
  // }
}



