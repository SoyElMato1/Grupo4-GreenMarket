import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private apiUrl = 'http://localhost:8000/modelo/';

  constructor(private http: HttpClient, private router: Router) { }


  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { username, password });
  }

  logout() {
    localStorage.removeItem('authToken');  // Elimina el token del almacenamiento local
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
