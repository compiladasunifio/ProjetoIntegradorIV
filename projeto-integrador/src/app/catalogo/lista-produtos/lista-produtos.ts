import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Produto } from '../../shared/models/produto';
import { Categoria } from '../../shared/models/categoria';
import { Avaliacao } from '../../shared/models/avaliacao';
import { ProdutoService } from '../../shared/services/produto-service';
import { CategoriaService } from '../../shared/services/categoria-service';
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
  private categoriaService = inject(CategoriaService);
  private avaliacaoService = inject(AvaliacaoService);

  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);
  private avaliacoes = signal<Avaliacao[]>([]);
  carregando = signal(true);
  somenteDisponiveis = signal(false);
  categoriaId = signal<number | null>(null); // null = todas

  filtrados = computed(() =>
    this.produtos().filter(p =>
      (!this.somenteDisponiveis() || p.disponivel) &&
      (this.categoriaId() === null || p.categoriaId === this.categoriaId()),
    ),
  );

  // Só mostra no filtro as categorias que têm produtos.
  categoriasComProdutos = computed(() => {
    const usadas = new Set(this.produtos().map(p => p.categoriaId));
    return this.categorias().filter(c => usadas.has(c.id));
  });

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
      categorias: this.categoriaService.listar(),
      avaliacoes: this.avaliacaoService.listar(),
    }).subscribe(({ produtos, categorias, avaliacoes }) => {
      this.produtos.set(produtos);
      this.categorias.set(categorias);
      this.avaliacoes.set(avaliacoes);
      this.carregando.set(false);
    });
  }

  escolherCategoria(id: number | null): void {
    this.categoriaId.set(id);
  }

  mostrarTodos(): void {
    this.somenteDisponiveis.set(false);
    this.categoriaId.set(null);
  }
}
