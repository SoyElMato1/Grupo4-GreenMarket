import { Component } from '@angular/core';
import { ChatbotService } from 'src/app/Servicios/Chatbot/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  userMessage: string = '';
  messages: any[] = [];

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    this.messages.push({ sender: 'user', text: this.userMessage });

    this.chatbotService.sendMessage(this.userMessage).subscribe(response => {
      response.forEach((msg: any) => {
        this.messages.push({ sender: 'bot', text: msg.text });
      });
    });

    this.userMessage = '';  // Limpiar el input después de enviar el mensaje
  }
}

