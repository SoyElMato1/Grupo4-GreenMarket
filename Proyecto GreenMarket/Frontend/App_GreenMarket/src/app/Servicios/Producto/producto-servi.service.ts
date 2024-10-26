import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoServiService {

  private apiUrl = 'http://127.0.0.1:8000/modelo/';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}producto/`);
  }

  // 1. Obtener productos por RUT del proveedor
  getProductosByProveedor(rut: string): Observable<any> {
    const token = localStorage.getItem('authToken'); // Asegúrate de que este sea el nombre correcto
    console.log('el token es', token)
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}` // Cambia a 'Bearer' si usas JWT
    });

    return this.http.get(`${this.apiUrl}productos/?rut=${rut}`, { headers });
  }

  // 2. Agregar un nuevo producto
  agregarProducto(producto: any, rutProveedor: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post(`${this.apiUrl}agreproductos/`, { ...producto, rut_proveedor: rutProveedor }, { headers });
  }

  // 3. Actualizar un producto existente por su ID
  modificarProducto(id: number, producto: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.put(`${this.apiUrl}productos/${id}/`, producto, { headers });
  }

  // 4. Eliminar un producto por su ID
  eliminarProducto(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.delete(`${this.apiUrl}productos/${id}/`, { headers });
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}categoria/`);
  }

}
