import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Producto } from 'src/app/Interfaces/producto';
import { Proveedor } from 'src/app/Interfaces/proveedor';


@Injectable({
  providedIn: 'root'
})
export class ProvedorServiService {
  // private baseUrl  = 'https://web-production-8ca5.up.railway.app/modelo/provee/';
  private baseUrl = 'http://127.0.0.1:8000/modelo/provee/';  // URL de tu API en el backend

  constructor(private http: HttpClient) { }

  // Método para obtener todos los proveedores
  getProveedores(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl).pipe(
      map((productos) =>
        productos.map(producto => {
          // Puedes agregar más lógica aquí si es necesario
          return producto;
        })
      )
    );
  }

  // // Obtener un proveedor por su RUT
  // getProveedor(rut: string): Observable<Proveedor> {
  //   return this.http.get<Proveedor>(`${this.baseUrl}${rut}/`);
  // }

  // // Crear un nuevo proveedor
  // createProveedor(proveedor: Proveedor): Observable<Proveedor> {
  //   return this.http.post<Proveedor>(this.baseUrl, proveedor);
  // }

  // // Actualizar un proveedor existente
  // updateProveedor(proveedor: Proveedor): Observable<Proveedor> {
  //   return this.http.put<Proveedor>(`${this.baseUrl}${proveedor.rut}/`, proveedor);
  // }

  // Eliminar un proveedor
  deleteProveedor(rut: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${rut}/`);
  }

}
