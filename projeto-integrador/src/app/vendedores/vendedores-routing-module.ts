import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroVendedor } from './cadastro-vendedor/cadastro-vendedor';
import { Login } from './login/login';
import { Perfil } from './perfil/perfil';
import { authGuard } from '../shared/guards/auth-guard';

const routes: Routes = [
  { path: 'cadastro', component: CadastroVendedor },
  { path: 'login', component: Login },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendedoresRoutingModule {}
