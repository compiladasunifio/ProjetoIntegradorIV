import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Avaliacao } from '../models/avaliacao';
import { lerSalvo, proximoId, salvar } from './armazenamento';

const CHAVE_AVALIACOES = 'unifood.avaliacoes';
// Ids das avaliações escritas neste navegador: só quem escreveu pode editar.
const CHAVE_MINHAS = 'unifood.minhas-avaliacoes';

const AVALIACOES_EXEMPLO: Avaliacao[] = [
  {
    id: 1, produtoId: 1, autorNome: 'Marina', nota: 5,
    comentario: 'Os melhores brigadeiros do campus! O de pistache é incrível.',
    data: '2026-11-10T14:20:00.000Z',
    resposta: 'Obrigada, Marina! Semana que vem tem sabor novo.', dataResposta: '2026-11-10T18:00:00.000Z',
  },
  {
    id: 2, produtoId: 1, autorNome: 'Pedro', nota: 4,
    comentario: 'Muito bons, só achei a caixa pequena pelo preço.',
    data: '2026-11-12T11:05:00.000Z',
  },
  {
    id: 3, produtoId: 2, autorNome: 'Júlia', nota: 5,
    comentario: 'Recheio caprichado, chegou bem gelado.',
    data: '2026-11-11T16:40:00.000Z',
  },
  {
    id: 4, produtoId: 4, autorNome: 'Rafael', nota: 4,
    comentario: 'Boa porção e bem temperada. Ótima opção para quem treina.',
    data: '2026-11-13T12:30:00.000Z',
  },
];

export type NovaAvaliacao = Pick<Avaliacao, 'produtoId' | 'autorNome' | 'nota' | 'comentario'>;

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private avaliacoes: Avaliacao[] = lerSalvo(CHAVE_AVALIACOES, () => AVALIACOES_EXEMPLO.map(a => ({ ...a })));
  private minhas = new Set<number>(lerSalvo<number[]>(CHAVE_MINHAS, () => []));

  // READ
  listar(): Observable<Avaliacao[]> {
    return of(this.copiar(this.avaliacoes)).pipe(delay(300));
  }

  listarPorProduto(produtoId: number): Observable<Avaliacao[]> {
    return this.listarPorProdutos([produtoId]);
  }

  listarPorProdutos(produtoIds: number[]): Observable<Avaliacao[]> {
    const ids = new Set(produtoIds);
    const lista = this.avaliacoes
      .filter(a => ids.has(a.produtoId))
      .sort((a, b) => b.data.localeCompare(a.data));
    return of(this.copiar(lista)).pipe(delay(300));
  }

  ehMinha(id: number): boolean {
    return this.minhas.has(id);
  }

  // CREATE (qualquer visitante)
  criar(dados: NovaAvaliacao): Observable<Avaliacao> {
    const nova: Avaliacao = {
      ...dados,
      nota: limitarNota(dados.nota),
      id: proximoId(this.avaliacoes),
      data: new Date().toISOString(),
    };
    this.avaliacoes.push(nova);
    this.minhas.add(nova.id);
    this.persistir();
    return of({ ...nova }).pipe(delay(400));
  }

  // UPDATE pelo autor (nota e comentário). Devolve undefined se não existir ou não for do autor.
  atualizar(id: number, dados: Pick<Avaliacao, 'autorNome' | 'nota' | 'comentario'>): Observable<Avaliacao | undefined> {
    if (!this.minhas.has(id)) return of(undefined).pipe(delay(400));
    return this.alterar(id, { ...dados, nota: limitarNota(dados.nota) });
  }

  // UPDATE pelo vendedor: escreve, troca ou (com texto vazio) apaga a resposta.
  responder(id: number, resposta: string): Observable<Avaliacao | undefined> {
    const texto = resposta.trim();
    return this.alterar(id, texto
      ? { resposta: texto, dataResposta: new Date().toISOString() }
      : { resposta: undefined, dataResposta: undefined });
  }

  // DELETE (pelo autor ou pelo vendedor do produto)
  excluir(id: number): Observable<boolean> {
    const antes = this.avaliacoes.length;
    this.avaliacoes = this.avaliacoes.filter(a => a.id !== id);
    this.minhas.delete(id);
    const removeu = this.avaliacoes.length < antes;
    if (removeu) this.persistir();
    return of(removeu).pipe(delay(400));
  }

  // Usado quando produtos são excluídos: as avaliações deles vão junto.
  excluirPorProdutos(produtoIds: number[]): void {
    const ids = new Set(produtoIds);
    const antes = this.avaliacoes.length;
    this.avaliacoes = this.avaliacoes.filter(a => !ids.has(a.produtoId));
    if (this.avaliacoes.length < antes) this.persistir();
  }

  private alterar(id: number, mudancas: Partial<Avaliacao>): Observable<Avaliacao | undefined> {
    const indice = this.avaliacoes.findIndex(a => a.id === id);
    if (indice < 0) return of(undefined).pipe(delay(400));
    const atualizada = { ...this.avaliacoes[indice], ...mudancas, id };
    this.avaliacoes[indice] = atualizada;
    this.persistir();
    return of({ ...atualizada }).pipe(delay(400));
  }

  private copiar(lista: Avaliacao[]): Avaliacao[] {
    return lista.map(a => ({ ...a }));
  }

  private persistir(): void {
    salvar(CHAVE_AVALIACOES, this.avaliacoes);
    salvar(CHAVE_MINHAS, [...this.minhas]);
  }
}

function limitarNota(nota: number): number {
  return Math.min(5, Math.max(1, Math.round(nota)));
}

// Média com uma casa decimal, ou null se não houver avaliações.
export function mediaNotas(lista: Pick<Avaliacao, 'nota'>[]): number | null {
  if (!lista.length) return null;
  const soma = lista.reduce((total, a) => total + a.nota, 0);
  return Math.round((soma / lista.length) * 10) / 10;
}
