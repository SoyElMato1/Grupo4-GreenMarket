import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ProveedorGuard } from './guards/proveedor.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'proveedor',
    loadChildren: () => import('./Paginas/proveedor/proveedor.module').then( m => m.ProveedorPageModule)
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
    loadChildren: () => import('./Paginas/Paneles/panel-administrador/panel-administrador.module').then( m => m.PanelAdministradorPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'panel-proveedor',
    loadChildren: () => import('./Paginas/Paneles/panel-proveedor/panel-proveedor.module').then( m => m.PanelProveedorPageModule),
    canActivate: [AuthGuard, ProveedorGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./Paginas/Paneles/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro-usuario',
    loadChildren: () => import('./Paginas/Paneles/registro-usuario/registro-usuario.module').then( m => m.RegistroUsuarioPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
