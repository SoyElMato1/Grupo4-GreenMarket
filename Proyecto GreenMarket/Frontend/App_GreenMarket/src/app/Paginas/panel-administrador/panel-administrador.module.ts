import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelAdministradorPageRoutingModule } from './panel-administrador-routing.module';

import { PanelAdministradorPage } from './panel-administrador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelAdministradorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PanelAdministradorPage]
})
export class PanelAdministradorPageModule {}
