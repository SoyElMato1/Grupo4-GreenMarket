import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudFormPage } from './crud-form.page';

const routes: Routes = [
  {
    path: '',
    component: CrudFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudFormPageRoutingModule {}
