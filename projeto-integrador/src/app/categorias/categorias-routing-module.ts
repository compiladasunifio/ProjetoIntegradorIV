import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GerenciarCategorias } from './gerenciar-categorias/gerenciar-categorias';

const routes: Routes = [
  { path: '', component: GerenciarCategorias },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasRoutingModule {}
