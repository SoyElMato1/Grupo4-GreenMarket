import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelProveedorPage } from './panel-proveedor.page';

const routes: Routes = [
  {
    path: '',
    component: PanelProveedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelProveedorPageRoutingModule {}
