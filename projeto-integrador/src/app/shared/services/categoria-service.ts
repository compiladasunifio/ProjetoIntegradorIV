import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Categoria } from '../models/categoria';
import { ProdutoService } from './produto-service';
import { lerSalvo, proximoId, salvar } from './armazenamento';

const CHAVE_CATEGORIAS = 'unifood.categorias';

const CATEGORIAS_EXEMPLO: Categoria[] = [
  { id: 1, nome: 'Doces' },
  { id: 2, nome: 'Salgados' },
  { id: 3, nome: 'Refeições' },
  { id: 4, nome: 'Bebidas' },
];

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private produtoService = inject(ProdutoService);
  private categorias: Categoria[] = lerSalvo(CHAVE_CATEGORIAS, () => [...CATEGORIAS_EXEMPLO]);

  listar(): Observable<Categoria[]> {
    return of([...this.categorias]).pipe(delay(200));
  }

  buscarNome(id: number | null): string | undefined {
    return this.categorias.find(c => c.id === id)?.nome;
  }

  salvar(nome: string): Observable<Categoria> {
    const nova: Categoria = { id: proximoId(this.categorias), nome };
    this.categorias.push(nova);
    salvar(CHAVE_CATEGORIAS, this.categorias);
    return of(nova).pipe(delay(200));
  }

  atualizar(id: number, nome: string): Observable<Categoria> {
    const atualizada: Categoria = { id, nome };
    this.categorias = this.categorias.map(c => (c.id === id ? atualizada : c));
    salvar(CHAVE_CATEGORIAS, this.categorias);
    this.produtoService.sincronizarCategoria(atualizada);
    return of(atualizada).pipe(delay(200));
  }

  // Devolve false se a categoria ainda tiver produtos (nesse caso não exclui).
  excluir(id: number): Observable<boolean> {
    if (this.produtoService.contarPorCategoria(id) > 0) return of(false).pipe(delay(200));
    this.categorias = this.categorias.filter(c => c.id !== id);
    salvar(CHAVE_CATEGORIAS, this.categorias);
    return of(true).pipe(delay(200));
  }
}
