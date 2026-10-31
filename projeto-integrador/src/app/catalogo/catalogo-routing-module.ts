import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProdutos } from './lista-produtos/lista-produtos';
import { DetalheProduto } from './detalhe-produto/detalhe-produto';

const routes: Routes = [
  { path: '', component: ListaProdutos },
  { path: 'produto/:id', component: DetalheProduto },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogoRoutingModule {}
