import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoRoutingModule } from './catalogo-routing-module';
import { ListaProdutos } from './lista-produtos/lista-produtos';
import { DetalheProduto } from './detalhe-produto/detalhe-produto';

@NgModule({
  declarations: [ListaProdutos, DetalheProduto],
  imports: [CommonModule, CatalogoRoutingModule],
})
export class CatalogoModule {}
