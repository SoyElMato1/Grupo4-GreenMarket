import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ChatbotComponent } from './Paginas/chatbot/chatbot.component';
import { PagoExitosoComponent } from './Paginas/Productos/pagos/pago-exitoso/pago-exitoso.component';
import { PagoFallidoComponent } from './Paginas/Productos/pagos/pago-fallido/pago-fallido.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';  // Importar FormsModule
import {HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent, ChatbotComponent, PagoExitosoComponent, PagoFallidoComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
