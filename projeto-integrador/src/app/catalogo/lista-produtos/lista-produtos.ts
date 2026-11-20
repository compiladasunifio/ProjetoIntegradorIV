import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Produto } from '../../shared/models/produto';
import { Avaliacao } from '../../shared/models/avaliacao';
import { ProdutoService } from '../../shared/services/produto-service';
import { AvaliacaoService, mediaNotas } from '../../shared/services/avaliacao-service';

export interface ResumoNotas {
  media: number | null;
  total: number;
}

@Component({
  selector: 'app-lista-produtos',
  standalone: false,
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.scss',
})
export class ListaProdutos implements OnInit {
  private produtoService = inject(ProdutoService);
  private avaliacaoService = inject(AvaliacaoService);

  produtos = signal<Produto[]>([]);
  private avaliacoes = signal<Avaliacao[]>([]);
  carregando = signal(true);
  somenteDisponiveis = signal(false);

  filtrados = computed(() =>
    this.produtos().filter(p => !this.somenteDisponiveis() || p.disponivel),
  );

  notas = computed(() => {
    const porProduto = new Map<number, Avaliacao[]>();
    for (const a of this.avaliacoes()) {
      porProduto.set(a.produtoId, [...(porProduto.get(a.produtoId) ?? []), a]);
    }
    const resumo = new Map<number, ResumoNotas>();
    for (const [id, lista] of porProduto) resumo.set(id, { media: mediaNotas(lista), total: lista.length });
    return resumo;
  });

  ngOnInit(): void {
    forkJoin({
      produtos: this.produtoService.listar(),
      avaliacoes: this.avaliacaoService.listar(),
    }).subscribe(({ produtos, avaliacoes }) => {
      this.produtos.set(produtos);
      this.avaliacoes.set(avaliacoes);
      this.carregando.set(false);
    });
  }

  mostrarTodos(): void {
    this.somenteDisponiveis.set(false);
  }
}
