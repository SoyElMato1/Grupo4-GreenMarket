import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { HistorialCompraPageRoutingModule } from './historial-compra-routing.module';

import { HistorialCompraPage } from './historial-compra.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    HistorialCompraPageRoutingModule
  ],
  declarations: [HistorialCompraPage]
})
export class HistorialCompraPageModule {}
