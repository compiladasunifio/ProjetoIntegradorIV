import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../../shared/models/produto';
import { ProdutoService } from '../../shared/services/produto-service';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-meus-produtos',
  standalone: false,
  templateUrl: './meus-produtos.html',
  styleUrl: './meus-produtos.scss',
})
export class MeusProdutos implements OnInit {
  private produtoService = inject(ProdutoService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  mensagem = signal('');
  // ids dos produtos com alguma operação em andamento
  ocupados = signal<ReadonlySet<number>>(new Set());

  ngOnInit(): void {
    const editado = this.route.snapshot.queryParamMap.get('editado');
    if (editado) this.mensagem.set(`Produto "${editado}" atualizado.`);

    this.produtoService.listarPorVendedor(this.auth.vendedor()!.id).subscribe(lista => {
      this.produtos.set(lista);
      this.carregando.set(false);
    });
  }

  ocupado(id: number): boolean {
    return this.ocupados().has(id);
  }

  alternarDisponivel(p: Produto, disponivel: boolean): void {
    this.marcar(p.id, true);
    this.produtoService.atualizar(p.id, { disponivel }).subscribe(atualizado => {
      this.marcar(p.id, false);
      if (atualizado) {
        this.produtos.update(lista => lista.map(x => (x.id === p.id ? atualizado : x)));
      }
    });
  }

  excluir(p: Produto): void {
    if (!confirm(`Excluir o produto "${p.nome}"? Essa ação não pode ser desfeita.`)) return;

    this.marcar(p.id, true);
    this.produtoService.excluir(p.id).subscribe(removido => {
      this.marcar(p.id, false);
      if (removido) {
        this.produtos.update(lista => lista.filter(x => x.id !== p.id));
        this.mensagem.set(`Produto "${p.nome}" excluído.`);
      } else {
        this.mensagem.set('Não foi possível excluir: o produto não existe mais.');
      }
    });
  }

  private marcar(id: number, ocupado: boolean): void {
    this.ocupados.update(atual => {
      const novo = new Set(atual);
      ocupado ? novo.add(id) : novo.delete(id);
      return novo;
    });
  }
}
