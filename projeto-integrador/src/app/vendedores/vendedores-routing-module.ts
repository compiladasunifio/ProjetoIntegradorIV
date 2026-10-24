import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroVendedor } from './cadastro-vendedor/cadastro-vendedor';
import { Login } from './login/login';
const routes: Routes = [
  { path: 'cadastro', component: CadastroVendedor },
  { path: 'login', component: Login},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendedoresRoutingModule {}
