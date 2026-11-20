import { Component, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Vendedor } from '../../shared/models/vendedor';
import { AuthService } from '../../shared/services/auth-service';
import { ProdutoService } from '../../shared/services/produto-service';
import { HorarioService } from '../../shared/services/horario-service';

type DadosVendedor = Omit<Vendedor, 'id'>;

@Component({
  selector: 'app-perfil',
  standalone: false,
  styleUrl: './perfil.scss',
  templateUrl: './perfil.html',
})
export class Perfil {
  protected auth = inject(AuthService);
  private produtoService = inject(ProdutoService);
  private horarioService = inject(HorarioService);
  private router = inject(Router);

  editando = signal(false);
  salvando = signal(false);
  excluindo = signal(false);
  mensagem = signal('');
  erro = signal('');

  dados: DadosVendedor = this.copiarDoPerfil();

  // Troca de senha
  trocandoSenha = signal(false);
  salvandoSenha = signal(false);
  erroSenha = signal('');
  senhas = this.senhasVazias();

  editar(): void {
    this.dados = this.copiarDoPerfil();
    this.mensagem.set('');
    this.erro.set('');
    this.trocandoSenha.set(false);
    this.editando.set(true);
  }

  cancelar(): void {
    this.erro.set('');
    this.editando.set(false);
  }

  salvar(form: NgForm): void {
    if (form.invalid || this.salvando()) return;

    this.salvando.set(true);
    this.erro.set('');

    const limpo: DadosVendedor = {
      nome: this.dados.nome.trim(),
      email: this.dados.email.trim(),
      telefone: this.dados.telefone.trim(),
      nomeNegocio: this.dados.nomeNegocio.trim(),
      localizacao: this.dados.localizacao.trim(),
    };

    this.auth.atualizar(limpo).subscribe(atualizado => {
      this.salvando.set(false);
      if (!atualizado) {
        this.erro.set('Já existe outra conta com esse e-mail.');
        return;
      }
      // Os produtos guardam nome do negócio e telefone: mantém tudo igual ao perfil.
      this.produtoService.sincronizarVendedor(atualizado);
      this.editando.set(false);
      this.mensagem.set('Perfil atualizado.');
    });
  }

  abrirTrocaSenha(): void {
    this.senhas = this.senhasVazias();
    this.mensagem.set('');
    this.erroSenha.set('');
    this.trocandoSenha.set(true);
  }

  cancelarTrocaSenha(): void {
    this.erroSenha.set('');
    this.trocandoSenha.set(false);
  }

  salvarSenha(form: NgForm): void {
    if (form.invalid || this.salvandoSenha()) return;

    const { atual, nova, confirmacao } = this.senhas;
    if (nova !== confirmacao) {
      this.erroSenha.set('A confirmação não é igual à nova senha.');
      return;
    }
    if (nova === atual) {
      this.erroSenha.set('A nova senha deve ser diferente da atual.');
      return;
    }

    this.salvandoSenha.set(true);
    this.erroSenha.set('');

    this.auth.alterarSenha(atual, nova).subscribe(ok => {
      this.salvandoSenha.set(false);
      if (!ok) {
        this.erroSenha.set('A senha atual está incorreta.');
        return;
      }
      this.trocandoSenha.set(false);
      this.senhas = this.senhasVazias();
      this.mensagem.set('Senha alterada. Use a nova senha no próximo login.');
    });
  }

  excluirConta(): void {
    const vendedor = this.auth.vendedor();
    if (!vendedor || this.excluindo()) return;
    if (!confirm('Excluir sua conta? Todos os seus produtos também serão removidos. Essa ação não pode ser desfeita.')) {
      return;
    }

    this.excluindo.set(true);
    this.horarioService.excluirPorVendedor(vendedor.id);
    this.produtoService
      .excluirPorVendedor(vendedor.id)
      .pipe(switchMap(() => this.auth.excluirConta()))
      .subscribe(() => {
        this.excluindo.set(false);
        this.router.navigateByUrl('/');
      });
  }

  private senhasVazias() {
    return { atual: '', nova: '', confirmacao: '' };
  }

  private copiarDoPerfil(): DadosVendedor {
    const v = this.auth.vendedor();
    return {
      nome: v?.nome ?? '',
      email: v?.email ?? '',
      telefone: v?.telefone ?? '',
      nomeNegocio: v?.nomeNegocio ?? '',
      localizacao: v?.localizacao ?? '',
    };
  }
}
