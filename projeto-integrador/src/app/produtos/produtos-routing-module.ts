import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroProduto } from './cadastro-produto/cadastro-produto';
import { MeusProdutos } from './meus-produtos/meus-produtos';

const routes: Routes = [
  {path: 'cadastro', component: CadastroProduto},
  {path: 'meus-produtos', component: MeusProdutos},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutosRoutingModule {}
