import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private rasaUrl = 'http://localhost:5005/webhooks/rest/webhook';  // Cambia esto si tu Rasa está en otra URL

  constructor(private http: HttpClient) {}

  // Método para enviar un mensaje al chatbot y recibir una respuesta
  sendMessage(message: string): Observable<any> {
    const payload = { sender: 'user', message: message };  // Cambia 'user' si necesitas otro identificador
    return this.http.post(this.rasaUrl, payload);
  }
}
