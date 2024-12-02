import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Proveedor } from 'src/app/Interfaces/proveedor';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private apiUrl = 'http://localhost:8000/modelo/';
  // private apiUrl = 'http://3.229.39.19:8000/modelo/';
  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { username, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token); // Guarda el token en localStorage
          localStorage.setItem('userRole', response.user.rol); // Guarda el rol del usuario si lo necesitas
          localStorage.setItem('rut', username);
        } else {
          console.error('Token no encontrado en la respuesta');
        }
      })
    );
  }

  getProveedorPerfil(): Observable<any> {
    const rut = localStorage.getItem('rut');
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`  // O usa 'Bearer' si usas JWT
    });

    return this.http.get(`${this.apiUrl}proveedores/${rut}/`, { headers });
  }

  // Método para actualizar el perfil del proveedor
  actualizarPerfilProveedor(proveedor: any): Observable<any> {
    const rut = localStorage.getItem('rut');  // Obtén el RUT del proveedor a actualizar
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
        'Authorization': `Token ${token}`,
        'Accept': 'application/json', // Asegúrate de que el tipo de contenido sea correcto
    });

    return this.http.put(`${this.apiUrl}proveedores/${rut}/`, proveedor, { headers });
}

  logout(headers: HttpHeaders): Observable<any> {
    return this.http.post(`${this.apiUrl}logout/`, {}, { headers });
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('authToken');  // Retorna el token desde el almacenamiento local
  }

  // Método para registrar un proveedor
  registerProveedor(proveedor: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}registro_proveedor/`, proveedor, { headers });
  }

  // Verifica si el usuario está autenticado revisando si hay un token en localStorage
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;  // Retorna true si el token existe
  }

  getUserRole(): string | null {
    const user = JSON.parse(localStorage.getItem('user_data')!);
    return user ? user.rol : null;
  }

}
