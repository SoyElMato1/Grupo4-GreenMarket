import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ProveedorGuard } from './guards/proveedor.guard';
import { PagoExitosoComponent } from './Paginas/pagos/pago-exitoso/pago-exitoso.component';
import { PagoFallidoComponent } from './Paginas/pagos/pago-fallido/pago-fallido.component';
import { ChatbotComponent } from './Paginas/chatbot/chatbot.component';  // Importa el componente del chatbot

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'proveedor',
    loadChildren: () => import('./Paginas/Proveedores/proveedor/proveedor.module').then( m => m.ProveedorPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./Paginas/Productos/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'catalogo-producto',
    loadChildren: () => import('./Paginas/Productos/catalogo-producto/catalogo-producto.module').then( m => m.CatalogoProductoPageModule)
  },
  {
    path: 'detalle-producto',
    loadChildren: () => import('./Paginas/Productos/detalle-producto/detalle-producto.module').then( m => m.DetalleProductoPageModule)
  },
  {
    path: 'panel-administrador',
    loadChildren: () => import('./Paginas/panel-administrador/panel-administrador.module').then( m => m.PanelAdministradorPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'panel-proveedor',
    loadChildren: () => import('./Paginas/Proveedores/panel-proveedor/panel-proveedor.module').then( m => m.PanelProveedorPageModule),
    canActivate: [AuthGuard, ProveedorGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./Paginas/login/login.module').then( m => m.LoginPageModule)
  },
  { path: 'pago-exitoso', component: PagoExitosoComponent },
  { path: 'pago-fallido', component: PagoFallidoComponent },
  { path: 'chatbot', component: ChatbotComponent },  // Añade la ruta del chatbot





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
