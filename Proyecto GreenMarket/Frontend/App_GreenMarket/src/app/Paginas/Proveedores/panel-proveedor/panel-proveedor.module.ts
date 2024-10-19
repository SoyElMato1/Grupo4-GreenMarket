import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelProveedorPageRoutingModule } from './panel-proveedor-routing.module';

import { PanelProveedorPage } from './panel-proveedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelProveedorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PanelProveedorPage]
})
export class PanelProveedorPageModule {}
