import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
