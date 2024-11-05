import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoServiService {

  private apiUrl = 'http://127.0.0.1:8000/modelo/';
  // private apiUrl = 'https://web-production-8ca5.up.railway.app/modelo/';

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

  getProductoById(id: number | null): Observable<any> {
    const token = localStorage.getItem('authToken'); // Asegúrate de que este sea el nombre correcto
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}` // Cambia a 'Bearer' si usas JWT
    });
    return this.http.get(`${this.apiUrl}producto/${id}/`, { headers });
  }

  getdetalleProducto(id: number): Observable<any> {

    return this.http.get(`${this.apiUrl}producto/${id}/`);
  }

  // 2. Agregar un nuevo producto
  agregarProducto(producto: any): Observable<any> {
    const rut_proveedor = localStorage.getItem('rut')
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.post(`${this.apiUrl}agreproducto/`, {producto, rut_proveedor }, { headers });
  }

  // 3. Actualizar un producto existente por su ID
  modificarProducto(id: number, producto: any): Observable<any> {
    const rut_proveedor = localStorage.getItem('rut')
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.put(`${this.apiUrl}productos/${id}/`, {producto, rut_proveedor  }, { headers });
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
