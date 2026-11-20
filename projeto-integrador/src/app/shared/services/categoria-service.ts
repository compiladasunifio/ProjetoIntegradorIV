import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Categoria } from '../models/categoria';
import { ProdutoService } from './produto-service';
import { lerSalvo, proximoId, salvar } from './armazenamento';

const CHAVE_CATEGORIAS = 'unifood.categorias';

export const CATEGORIAS_EXEMPLO: Categoria[] = [
  { id: 1, nome: 'Doces', icone: 'cake' },
  { id: 2, nome: 'Salgados', icone: 'bakery_dining' },
  { id: 3, nome: 'Refeições', icone: 'lunch_dining' },
  { id: 4, nome: 'Bebidas', icone: 'local_cafe' },
];

// Ícones que o vendedor pode escolher para uma categoria.
export const ICONES_CATEGORIA = [
  { icone: 'cake', nome: 'Bolo' },
  { icone: 'bakery_dining', nome: 'Padaria' },
  { icone: 'lunch_dining', nome: 'Lanche' },
  { icone: 'restaurant', nome: 'Refeição' },
  { icone: 'local_pizza', nome: 'Pizza' },
  { icone: 'icecream', nome: 'Sorvete' },
  { icone: 'local_cafe', nome: 'Café' },
  { icone: 'local_bar', nome: 'Bebida' },
  { icone: 'eco', nome: 'Natural' },
  { icone: 'cookie', nome: 'Biscoito' },
];

export type ResultadoExclusao = 'ok' | 'em-uso' | 'nao-encontrada';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private produtoService = inject(ProdutoService);
  private categorias: Categoria[] = lerSalvo(CHAVE_CATEGORIAS, () => CATEGORIAS_EXEMPLO.map(c => ({ ...c })));

  // READ
  listar(): Observable<Categoria[]> {
    const lista = [...this.categorias].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    return of(lista.map(c => ({ ...c }))).pipe(delay(200));
  }

  obterPorId(id: number): Categoria | undefined {
    const c = this.categorias.find(x => x.id === id);
    return c && { ...c };
  }

  // CREATE — devolve null se já existir categoria com esse nome.
  salvar(dados: Omit<Categoria, 'id'>): Observable<Categoria | null> {
    if (this.nomeEmUso(dados.nome)) return of(null).pipe(delay(300));
    const nova: Categoria = { ...dados, nome: dados.nome.trim(), id: proximoId(this.categorias) };
    this.categorias.push(nova);
    this.persistir();
    return of({ ...nova }).pipe(delay(300));
  }

  // UPDATE — devolve null se o nome já for de outra categoria ou se ela não existir.
  atualizar(id: number, dados: Omit<Categoria, 'id'>): Observable<Categoria | null> {
    const indice = this.categorias.findIndex(c => c.id === id);
    if (indice < 0 || this.nomeEmUso(dados.nome, id)) return of(null).pipe(delay(300));

    const atualizada: Categoria = { ...dados, nome: dados.nome.trim(), id };
    this.categorias[indice] = atualizada;
    this.persistir();
    this.produtoService.sincronizarCategoria(atualizada);
    return of({ ...atualizada }).pipe(delay(300));
  }

  // DELETE — não deixa excluir categoria que ainda tem produtos.
  excluir(id: number): Observable<ResultadoExclusao> {
    if (!this.categorias.some(c => c.id === id)) return of<ResultadoExclusao>('nao-encontrada').pipe(delay(300));
    if (this.produtoService.contarPorCategoria(id) > 0) return of<ResultadoExclusao>('em-uso').pipe(delay(300));

    this.categorias = this.categorias.filter(c => c.id !== id);
    this.persistir();
    return of<ResultadoExclusao>('ok').pipe(delay(300));
  }

  private nomeEmUso(nome: string, ignorarId?: number): boolean {
    const alvo = nome.trim().toLocaleLowerCase('pt-BR');
    return this.categorias.some(c => c.id !== ignorarId && c.nome.toLocaleLowerCase('pt-BR') === alvo);
  }

  private persistir(): void {
    salvar(CHAVE_CATEGORIAS, this.categorias);
  }
}
