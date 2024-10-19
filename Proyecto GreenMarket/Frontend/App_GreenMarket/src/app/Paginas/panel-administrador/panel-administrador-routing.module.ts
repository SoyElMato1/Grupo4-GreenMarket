import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelAdministradorPage } from './panel-administrador.page';

const routes: Routes = [
  {
    path: '',
    component: PanelAdministradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelAdministradorPageRoutingModule {}
