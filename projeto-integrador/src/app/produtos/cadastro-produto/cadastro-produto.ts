import { Component, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProdutoService } from '../../shared/services/produto-service';
import { AuthService } from '../../shared/services/auth-service';


@Component({
  selector: 'app-cadastro-produto',
  standalone: false,
  templateUrl: './cadastro-produto.html',
  styleUrl: './cadastro-produto.scss',
  
})
export class CadastroProduto {
  private produtoService = inject(ProdutoService);
  private auth = inject(AuthService);

  produto = this.novoProduto();
  mensagem = signal('');
  salvando = signal(false);

  salvar(form: NgForm): void {
    if (form.invalid || this.salvando()) return;

    this.salvando.set(true);
    this.mensagem.set('');

    this.produtoService
      .salvar({
        nome: this.produto.nome.trim(),
        descricao: this.produto.descricao.trim(),
        preco: this.produto.preco ?? 0,
        imagemUrl: this.produto.imagemUrl.trim(),
        disponivel: this.produto.disponivel,
        localizacao: this.produto.localizacao.trim(),
        vendedorId: this.auth.vendedor()!.id,
      })
      .subscribe(salvo => {
        this.salvando.set(false);
        this.mensagem.set(`Produto "${salvo.nome}" cadastrado (dados simulados, sem banco).`);
        form.resetForm(this.novoProduto());
      });
  }

  limpar(form: NgForm): void {
    form.resetForm(this.novoProduto());
    this.mensagem.set('');
  }

  private novoProduto() {
    return {
      nome: '',
      descricao: '',
      preco: null as number | null,
      imagemUrl: '',
      disponivel: true,
      localizacao: '',
    };
  }
}