import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { CatalogoRoutingModule } from './catalogo-routing-module';
import { ListaProdutos } from './lista-produtos/lista-produtos';
import { DetalheProduto } from './detalhe-produto/detalhe-produto';
import { AvaliacoesProduto } from './avaliacoes-produto/avaliacoes-produto';

@NgModule({
  declarations: [ListaProdutos, DetalheProduto, AvaliacoesProduto],
  imports: [CommonModule, SharedModule, CatalogoRoutingModule],
})
export class CatalogoModule {}
