import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Produto } from '../../shared/models/produto';
import { ProdutoService } from '../../shared/services/produto-service';

@Component({
  selector: 'app-lista-produtos',
  standalone: false,
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.scss',
})
export class ListaProdutos implements OnInit {
  private produtoService = inject(ProdutoService);

  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  somenteDisponiveis = signal(false);

  filtrados = computed(() =>
    this.produtos().filter(p => !this.somenteDisponiveis() || p.disponivel),
  );

  ngOnInit(): void {
    this.produtoService.listar().subscribe(lista => {
      this.produtos.set(lista);
      this.carregando.set(false);
    });
  }

  mostrarTodos(): void {
    this.somenteDisponiveis.set(false);
  }
}