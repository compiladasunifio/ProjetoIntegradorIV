import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { ProdutosRoutingModule } from './produtos-routing-module';
import { CadastroProduto } from './cadastro-produto/cadastro-produto';
import { MeusProdutos } from './meus-produtos/meus-produtos';

@NgModule({
  declarations: [CadastroProduto, MeusProdutos],
  imports: [CommonModule,SharedModule, ProdutosRoutingModule],
})
export class ProdutosModule {}
