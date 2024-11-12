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
  proveedoresFiltrados: any =[]
  mostrarModal: boolean = false;
  nombreProveedorSeleccionado: string = ''; // Para almacenar el nombre del proveedor seleccionado

  proveedoresDestacados = [
    {
      rut: '12345678-9',
      nombre: 'Proveedor Ejemplo 1',
      calificacion: 4.8,
      descripcion: 'Descripción breve del proveedor...',
      foto: 'https://www.google.com/url?sa=i&url=https%3A%https://images.ecestaticos.com/eydZE-aqEu9tN1nDy2QVkPj9eRY=/0x0:1024x768/1200x1200/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fd66%2F5fe%2Fbd5%2Fd665febd5c3b5e1d5adca155019b0924.jpg2F%2Fwww.imdb.com%https://hips.hearstapps.com/hmg-prod/images/keanu-reeves-65bcbb7c05055.jpg?crop=0.672xw:1.00xh;0.130xw,0&resize=980:*https://static.wikia.nocookie.net/doblaje/images/f/fa/Keanu_reeves_2022.jpg/revision/latest?cb=20240503020216&path-prefix=es2Fname%2Fnm0000206%2F&psig=AOvVaw1OYuIRW4ywoEFR342HYY78&ust=1731378137685000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDfkaic04kDFQAAAAAdAAAAABAQ'
    },
    {
      rut: '87654321-0',
      nombre: 'Proveedor Ejemplo 2',
      calificacion: 4.5,
      descripcion: 'Descripción breve del proveedor...',
      foto: 'http://localhost:8000/proveedor_images/ejemplo2.jpg'
    },
    // Agrega más proveedores si es necesario
  ];


  constructor(private proveedorService: ProvedorServiService,
              private router : Router,
              private http:HttpClient,
              private productoService: ProductoServiService) { }

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
    scrollToTop() {
      // Desplaza la vista hacia la parte superior
      document.querySelector('ion-content')?.scrollToTop(500); // 500 ms es la duración del desplazamiento
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
  // verProductosProveedor(rutProveedor: string) {
  //   this.productoService.getProductosByProveedor(rutProveedor).subscribe(
  //     (productos) => {
  //       this.productos = productos;  // Almacena los productos en una variable
  //     },
  //     (error) => {
  //       console.error('Error al obtener productos del proveedor', error);
  //     }
  //   );
  // }
  // verProductosProveedor(rut: string) {
  //   // Simulamos la carga de los productos del proveedor por su rut
  //   // Normalmente, aquí harías una llamada a tu servicio para obtener los productos del proveedor
  //   this.productos = [
  //     { nombre_producto: 'Producto 1', precio: 1000 },
  //     { nombre_producto: 'Producto 2', precio: 1500 },
  //     { nombre_producto: 'Producto 3', precio: 2000 }
  //   ];

  //   // Mostrar el modal cuando se presiona el botón
  //   document.getElementById('modalProductos')?.classList.add('d-block');
  // }
  // verProductosProveedor(rutProveedor: string) {
  //   // Llamada al servicio para obtener los productos del proveedor
  //   this.productoService.getProductosByProveedor(rutProveedor).subscribe(
  //     (productos) => {
  //       this.productos = productos;  // Almacena los productos en una variable
  //       // Mostrar el modal al obtener los productos
  //       document.getElementById('modalProductos')?.classList.add('d-block');
  //     },
  //     (error) => {
  //       console.error('Error al obtener productos del proveedor', error);
  //     }
  //   );
  // }

  // cerrarModal() {
  //   // Ocultar el modal
  //   this.productos = []; // Limpiar la lista de productos
  //   document.getElementById('modalProductos')?.classList.remove('d-block');
  // }


  verProductosProveedor(rutProveedor: string, nombreProveedor: string) {
    // Llamada al servicio para obtener los productos del proveedor
    this.productoService.getProductosByProveedor(rutProveedor).subscribe(
      (productos) => {
        this.productos = productos.slice(0, 3);  // Limita a 3 productos
        this.nombreProveedorSeleccionado = nombreProveedor;  // Almacena el nombre del proveedor
        this.mostrarModal = true;
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


  // verProductosProveedor(rutProveedor: string) {
  //   this.productoService.getProductosByProveedor(rutProveedor).subscribe(
  //     (productos) => {
  //       this.productos = productos;  // Almacena los productos en una variable
  //       this.mostrarModal = true;  // Muestra el modal
  //     },
  //     (error) => {
  //       console.error('Error al obtener productos del proveedor', error);
  //     }
  //   );
  // }

  // cerrarModal() {
  //   this.mostrarModal = false;  // Oculta el modal
  // }
}
