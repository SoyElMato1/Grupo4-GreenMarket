import { Component } from '@angular/core';
import { ChatbotService } from 'src/app/Servicios/Chatbot/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  userMessage: string = '';
  selectedImage: File | null = null; // Para almacenar la imagen seleccionada
  imageSelected: boolean = false; // Para controlar si se seleccionó una imagen
  messages: any[] = [];

  constructor(private chatbotService: ChatbotService) {}

  // Método para enviar mensaje de texto
  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ sender: 'user', text: this.userMessage });
      this.chatbotService.sendMessage(this.userMessage).subscribe(response => {
        response.forEach((msg: any) => {
          this.messages.push({ sender: 'bot', text: msg.text });
        });
      });
      this.userMessage = ''; // Limpiar el input después de enviar el mensaje
    }
  }

  // Método para manejar la selección de la imagen
  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      // Verificar si el archivo es una imagen válida (por ejemplo, JPEG o PNG)
      const validTypes = ['image/jpeg', 'image/png'];
      if (validTypes.includes(file.type)) {
        this.selectedImage = file;
        this.imageSelected = true;  // Cambiar el estado a imagen seleccionada
      } else {
        alert('Por favor, selecciona una imagen JPEG o PNG.');
      }
    }
  }

  // Método para enviar la imagen al backend
  sendImage() {
    if (this.selectedImage) {
      this.chatbotService.sendImage(this.selectedImage).subscribe(response => {
        // Verificar cómo está estructurada la respuesta
        console.log('Respuesta completa del backend:', response);

        // Acceder al array 'resultados' y obtener la planta con la mayor probabilidad
        const resultados = response.resultados || [];

        // Si hay resultados, tomar el primer resultado (el de mayor probabilidad)
        const planta = resultados.length > 0 ? resultados[0].etiqueta : 'Desconocida';

        // Mostrar la respuesta del bot con el nombre de la planta detectada
        this.messages.push({ sender: 'bot', text: `Planta detectada: ${planta}` });
      });
      this.selectedImage = null;  // Limpiar la imagen seleccionada después de enviarla
      this.imageSelected = false; // Resetear el estado de la imagen seleccionada
    }
  }
}
