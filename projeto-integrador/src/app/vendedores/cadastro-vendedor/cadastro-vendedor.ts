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
  erro = signal('');

  salvar(form: NgForm): void {
    if (form.invalid || this.salvando()) return;

    this.salvando.set(true);
    this.erro.set('');
    const { senha, ...dados } = this.vendedor; // a senha vai separada: só o hash dela é guardado

    this.auth.cadastrar(dados, senha).subscribe(criada => {
      this.salvando.set(false);
      if (!criada) {
        this.erro.set('Já existe uma conta com esse e-mail. Tente entrar.');
        return;
      }
      this.router.navigate(['/vendedores/login'], { queryParams: { cadastro: 'ok' } });
    });
  }

  limpar(form: NgForm): void {
    form.resetForm(this.novoVendedor());
    this.erro.set('');
  }

  private novoVendedor() {
    return { nome: '', email: '', senha: '', telefone: '', nomeNegocio: '', localizacao: '' };
  }
}