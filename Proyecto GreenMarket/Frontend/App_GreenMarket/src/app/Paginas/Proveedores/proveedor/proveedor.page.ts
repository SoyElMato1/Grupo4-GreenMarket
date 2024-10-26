import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProvedorServiService } from 'src/app/Servicios/Proveedor/provedor-servi.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.page.html',
  styleUrls: ['./proveedor.page.scss'],
})
export class ProveedorPage implements OnInit {

  proveedores: any = [];
  showSearchBar = false;
  proveedoresFiltrados: any =[]

  constructor(private proveedorService: ProvedorServiService,
              private router : Router,
              private http:HttpClient) { }

  ngOnInit() {
    this.getProveedores();
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      // Aquí puedes actualizar los datos del carrito cuando la navegación termine
      this.getProveedores();
  });
  }

  getProveedores() {
    this.proveedorService.getProveedores().subscribe(
      (data) => {
        this.proveedoresFiltrados = data;
      }
    );
  }

    catalogo_producto(){
      this.router.navigate(['/catalogo-producto'])
    }

    private generateItems() {
      const count = this.proveedores.length + 1;
      for (let i = 0; i < 50; i++) {
        this.proveedores.push(`Item ${count + i}`);
      }
    }
    onIonInfinite(ev: InfiniteScrollCustomEvent) {
      this.generateItems();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 100);
    }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }
  onSearch(event: any) {
    const query = event.target.value.trim().toLowerCase(); // Elimina espacios en blanco y convierte a minúsculas
    console.log('Buscando: ', query);

    // Si la consulta está vacía, muestra todos los proveedores
    if (query === '') {
        this.proveedoresFiltrados = this.proveedores;
        return; // Termina la función si no hay consulta
    }
    // Divide la consulta en palabras
    const searchTerms = query.split(/\s+/); // Divide por uno o más espacios
    // Filtra los proveedores
    this.proveedoresFiltrados = this.proveedores.filter((proveedor: any) => {
        // Verifica si todas las palabras están en el nombre o el apellido
        return searchTerms.every((term: any) =>
            proveedor.nombre.toLowerCase().includes(term) ||
            proveedor.apellido.toLowerCase().includes(term)
        );
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Redirigir a la página de login
  }

}
