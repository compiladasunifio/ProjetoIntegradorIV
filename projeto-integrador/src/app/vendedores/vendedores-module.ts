import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { VendedoresRoutingModule } from './vendedores-routing-module';
import { CadastroVendedor } from './cadastro-vendedor/cadastro-vendedor';
import { Login } from './login/login';
import { Perfil } from './perfil/perfil';
import { HorariosAtendimento } from './horarios-atendimento/horarios-atendimento';

@NgModule({
  declarations: [CadastroVendedor, Login, Perfil, HorariosAtendimento],
  imports: [CommonModule, SharedModule, VendedoresRoutingModule],
})
export class VendedoresModule {}
