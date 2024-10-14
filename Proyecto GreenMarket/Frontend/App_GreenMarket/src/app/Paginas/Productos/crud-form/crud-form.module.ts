import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudFormPageRoutingModule } from './crud-form-routing.module';

import { CrudFormPage } from './crud-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrudFormPageRoutingModule
  ],
  declarations: [CrudFormPage]
})
export class CrudFormPageModule {}
