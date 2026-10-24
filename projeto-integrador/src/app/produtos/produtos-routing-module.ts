import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroProduto } from './cadastro-produto/cadastro-produto';

const routes: Routes = [
  {path: 'cadastro', component: CadastroProduto}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutosRoutingModule {}
