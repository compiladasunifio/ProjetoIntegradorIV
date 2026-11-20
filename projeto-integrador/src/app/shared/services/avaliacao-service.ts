import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Avaliacao } from '../models/avaliacao';
import { lerSalvo, proximoId, salvar } from './armazenamento';

const CHAVE_AVALIACOES = 'unifood.avaliacoes';
// Ids das avaliações feitas neste navegador: só quem escreveu pode editar ou excluir.
const CHAVE_MINHAS = 'unifood.minhas-avaliacoes';

const AVALIACOES_EXEMPLO: Avaliacao[] = [
  { id: 1, produtoId: 1, autorNome: 'Marina', nota: 5, comentario: 'Os melhores brigadeiros do campus!', data: '2026-11-10' },
  { id: 2, produtoId: 1, autorNome: 'Pedro', nota: 4, comentario: 'Muito bons, só achei a caixa pequena.', data: '2026-11-12' },
  { id: 3, produtoId: 2, autorNome: 'Júlia', nota: 5, comentario: 'Recheio caprichado.', data: '2026-11-11' },
  { id: 4, produtoId: 4, autorNome: 'Rafael', nota: 4, comentario: 'Boa porção e bem temperada.', data: '2026-11-13' },
];

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private avaliacoes: Avaliacao[] = lerSalvo(CHAVE_AVALIACOES, () => [...AVALIACOES_EXEMPLO]);
  private minhas: number[] = lerSalvo(CHAVE_MINHAS, () => []);

  listar(): Observable<Avaliacao[]> {
    return of([...this.avaliacoes]).pipe(delay(200));
  }

  listarPorProduto(produtoId: number): Observable<Avaliacao[]> {
    return of(this.avaliacoes.filter(a => a.produtoId === produtoId)).pipe(delay(200));
  }

  ehMinha(id: number): boolean {
    return this.minhas.includes(id);
  }

  criar(dados: Omit<Avaliacao, 'id' | 'data'>): Observable<void> {
    const nova: Avaliacao = {
      ...dados,
      id: proximoId(this.avaliacoes),
      data: new Date().toISOString().slice(0, 10),
    };
    this.avaliacoes.push(nova);
    this.minhas.push(nova.id);
    this.salvarTudo();
    return of(undefined).pipe(delay(200));
  }

  atualizar(id: number, dados: Pick<Avaliacao, 'autorNome' | 'nota' | 'comentario'>): Observable<void> {
    this.avaliacoes = this.avaliacoes.map(a => (a.id === id ? { ...a, ...dados } : a));
    this.salvarTudo();
    return of(undefined).pipe(delay(200));
  }

  excluir(id: number): Observable<void> {
    this.avaliacoes = this.avaliacoes.filter(a => a.id !== id);
    this.minhas = this.minhas.filter(m => m !== id);
    this.salvarTudo();
    return of(undefined).pipe(delay(200));
  }

  // Quando um produto é excluído, as avaliações dele vão junto.
  excluirPorProdutos(produtoIds: number[]): void {
    this.avaliacoes = this.avaliacoes.filter(a => !produtoIds.includes(a.produtoId));
    this.salvarTudo();
  }

  private salvarTudo(): void {
    salvar(CHAVE_AVALIACOES, this.avaliacoes);
    salvar(CHAVE_MINHAS, this.minhas);
  }
}

// Média com uma casa decimal, ou null se não houver avaliações.
export function mediaNotas(lista: Avaliacao[]): number | null {
  if (!lista.length) return null;
  const soma = lista.reduce((total, a) => total + a.nota, 0);
  return Math.round((soma / lista.length) * 10) / 10;
}
