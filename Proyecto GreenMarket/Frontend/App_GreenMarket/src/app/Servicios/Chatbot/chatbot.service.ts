import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private rasaUrl = environment.APIRasa; // Cambia esto si tu Rasa está en otra URL
  private uploadUrl = environment.APIbackend; // URL del backend para carga de imágenes

  constructor(private http: HttpClient) {}

  // Método para enviar un mensaje al chatbot
  sendMessage(message: string): Observable<any> {
    const payload = { sender: 'user', message: message }; // Cambia 'user' si necesitas otro identificador
    return this.http.post(this.rasaUrl, payload);
  }

  // Método para enviar una imagen al backend
  sendImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post( `${this.uploadUrl}api/chat/upload`, formData);
  }
}
