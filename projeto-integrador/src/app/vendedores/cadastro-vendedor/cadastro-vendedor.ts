import { Component, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-cadastro-vendedor',
  standalone: false,
  templateUrl: './cadastro-vendedor.html',
  styleUrl: './cadastro-vendedor.scss',
})
export class CadastroVendedor {
  private auth = inject(AuthService);
  private router = inject(Router);

  vendedor = this.novoVendedor();
  salvando = signal(false);

  salvar(form: NgForm): void {
    if (form.invalid || this.salvando()) return;

    this.salvando.set(true);
    const { senha, ...dados } = this.vendedor; // a senha não entra no modelo do vendedor

    this.auth.cadastrar(dados).subscribe(() => {
      this.salvando.set(false);
      this.router.navigateByUrl('/produtos/meus-produtos');
    });
  }

  limpar(form: NgForm): void {
    form.resetForm(this.novoVendedor());
  }

  private novoVendedor() {
    return { nome: '', email: '', senha: '', telefone: '', nomeNegocio: '', localizacao: '' };
  }
}