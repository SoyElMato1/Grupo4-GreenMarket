import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialCompraPage } from './historial-compra.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialCompraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialCompraPageRoutingModule {}
