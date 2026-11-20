import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroProduto } from './cadastro-produto/cadastro-produto';
import { MeusProdutos } from './meus-produtos/meus-produtos';
import { Painel } from './painel/painel';

const routes: Routes = [
  { path: 'cadastro', component: CadastroProduto },
  { path: 'editar/:id', component: CadastroProduto },
  { path: 'meus-produtos', component: MeusProdutos },
  { path: 'painel', component: Painel },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutosRoutingModule {}
