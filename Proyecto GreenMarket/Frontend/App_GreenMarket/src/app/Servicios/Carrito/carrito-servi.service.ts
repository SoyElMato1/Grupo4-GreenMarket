import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { Carrito } from 'src/app/Interfaces/carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoServiService {

  private apiUrl = 'http://127.0.0.1:8000/modelo/';

  // BehaviorSubject to track number of items in the cart
  private cartItemCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  ver_carrito(): Observable<any> {
    return this.http.get(`${this.apiUrl}carrito/`); // Asegúrate de que la URL sea correcta
}

  agregar_Carrito(productoId: number): Observable<any> {
    const url = `${this.apiUrl}agregar/${productoId}/`;
    return this.http.post(url, {}, { withCredentials: true });
  }

  checkout(data: any) {
    const headers = { 'Content-Type': 'application/json' }; // Asegúrate de tener las cabeceras
    return this.http.post('http://127.0.0.1:8000/modelo/checkout/', data, { headers });
  }

  // Getter for the cart item count observable
  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  // Method to update the cart item count
  updateCartCount() {
    this.ver_carrito();
  }

   // Implementación del método restar_carrito
  restar_carrito(productId: number): Observable<any> {
    const url = `${this.apiUrl}restar/${productId}/`;
    return this.http.post(url, {}, { withCredentials: true });
  }

  iniciarPago(data: { total: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}pago/iniciar/`, data);
  }

  // Método para limpiar el carrito
  limpiarCarrito(): Observable<any> {
    const url = `${this.apiUrl}limpiar/`; // Asegúrate de que esta URL sea correcta
    return this.http.post(url, {}, { withCredentials: true });
  }

  // Método para eliminar un item del carrito
  eliminar_carrito(productId: number): Observable<any> {
    const url = `${this.apiUrl}eliminar/${productId}/`;
    return this.http.post(url, {}, { withCredentials: true });
  }


}
