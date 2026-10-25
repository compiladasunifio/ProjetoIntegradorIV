import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home-module').then(m => m.HomeModule),
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./catalogo/catalogo-module').then(m => m.CatalogoModule),
  },
  {
    path: 'produtos',
    canActivate: [authGuard],
    loadChildren: () => import('./produtos/produtos-module').then(m => m.ProdutosModule),
  },
  {
    path: 'vendedores',
    loadChildren: () => import('./vendedores/vendedores-module').then(m => m.VendedoresModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}