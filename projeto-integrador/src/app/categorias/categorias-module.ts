import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { CategoriasRoutingModule } from './categorias-routing-module';
import { GerenciarCategorias } from './gerenciar-categorias/gerenciar-categorias';

@NgModule({
  declarations: [GerenciarCategorias],
  imports: [CommonModule, SharedModule, CategoriasRoutingModule],
})
export class CategoriasModule {}
