import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProvedorServiService } from 'src/app/Servicios/Proveedor/provedor-servi.service';
import { ProductoServiService } from 'src/app/Servicios/Producto/producto-servi.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.page.html',
  styleUrls: ['./proveedor.page.scss'],
})
export class ProveedorPage implements OnInit {
  productos: any[] = [];
  proveedores: any = [];
  showSearchBar = false;
  proveedoresFiltrados: any = [];
  mostrarModal: boolean = false;
  mostrarAlerta: boolean = false;  // Controla la alerta
  nombreProveedorSeleccionado: string = ''; // Para almacenar el nombre del proveedor seleccionado

  proveedoresDestacados = [
    {
      rut: '12345678-9',
      nombre: 'Proveedor Ejemplo 1',
      calificacion: 4.8,
      descripcion: 'Descripción breve del proveedor...',
      foto: 'https://www.example.com/foto1.jpg'
    },
    {
      rut: '87654321-0',
      nombre: 'Proveedor Ejemplo 2',
      calificacion: 4.5,
      descripcion: 'Descripción breve del proveedor...',
      foto: 'http://localhost:8000/proveedor_images/ejemplo2.jpg'
    },
  ];

  constructor(private proveedorService: ProvedorServiService,
              private router: Router,
              private http: HttpClient,
              private productoService: ProductoServiService) { }

  ngOnInit() {
    this.getProveedores();
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
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

  verProductosProveedor(rutProveedor: string, nombreProveedor: string) {
    this.productoService.getProductosByProveedor(rutProveedor).subscribe(
      (productos) => {
        this.productos = productos.slice(0, 3);  // Limita a 3 productos
        this.nombreProveedorSeleccionado = nombreProveedor;  // Almacena el nombre del proveedor
        if (this.productos.length === 0) {
          this.mostrarAlerta = true; // Muestra la alerta si no hay productos
          setTimeout(() => {
            this.mostrarAlerta = false;  // Desaparece la alerta después de 5 segundos
          }, 5000);
        } else {
          this.mostrarModal = true;  // Muestra el modal si hay productos
        }
      },
      (error) => {
        console.error('Error al obtener productos del proveedor', error);
      }
    );
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.productos = []; // Limpiar los productos al cerrar el modal
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }

  onSearch(event: any) {
    const query = event.target.value.trim().toLowerCase();
    if (query === '') {
        this.proveedoresFiltrados = this.proveedores;
        return;
    }
    const searchTerms = query.split(/\s+/); // Divide por uno o más espacios
    this.proveedoresFiltrados = this.proveedores.filter((proveedor: any) => {
        return searchTerms.every((term: any) =>
            proveedor.nombre.toLowerCase().includes(term) ||
            proveedor.apellido.toLowerCase().includes(term)
        );
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
