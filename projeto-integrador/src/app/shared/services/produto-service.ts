import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Produto } from '../models/produto';
import { Vendedor } from '../models/vendedor';
import { AvaliacaoService } from './avaliacao-service';

const CHAVE_PRODUTOS = 'unifood.produtos';

// SIMULAÇÃO: produtos de exemplo do catálogo, usados quando ainda não há nada salvo.
const PRODUTOS_EXEMPLO: Produto[] = [
  {
    id: 1, nome: 'Brigadeiro gourmet', descricao: 'Caixa com 6 unidades, sabores variados.',
    preco: 12, imagemUrl: '', disponivel: true, localizacao: 'Bloco 5',
    vendedorId: 1, vendedorNome: 'Doces da Isa', vendedorTelefone: '11900000000',
  },
  {
    id: 2, nome: 'Pão de mel', descricao: 'Recheado com doce de leite e coberto com chocolate.',
    preco: 7.5, imagemUrl: '', disponivel: true, localizacao: 'Biblioteca',
    vendedorId: 2, vendedorNome: 'Cantinho do Bruno', vendedorTelefone: '11900000001',
  },
  {
    id: 3, nome: 'Coxinha de frango', descricao: 'Salgado frito na hora, com catupiry.',
    preco: 6, imagemUrl: '', disponivel: false, localizacao: 'Bloco 6',
    vendedorId: 3, vendedorNome: 'Salgados da Carol', vendedorTelefone: '11900000002',
  },
  {
    id: 4, nome: 'Marmita fitness', descricao: 'Frango, arroz integral e legumes. Encomende até as 10h.',
    preco: 18, imagemUrl: '', disponivel: true, localizacao: 'Bloco 2',
    vendedorId: 4, vendedorNome: 'Fit Express', vendedorTelefone: '11900000003',
  },
];

export type DadosProduto = Omit<Produto, 'id'>;

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private avaliacaoService = inject(AvaliacaoService);
  // SIMULAÇÃO: produtos guardados só neste navegador (sessionStorage), sem banco.
  private produtos: Produto[] = this.carregar();

  // READ
  listar(): Observable<Produto[]> {
    return of(this.copiar(this.produtos)).pipe(delay(300));
  }

  listarPorVendedor(vendedorId: number): Observable<Produto[]> {
    return of(this.copiar(this.produtos.filter(p => p.vendedorId === vendedorId))).pipe(delay(300));
  }

  obterPorId(id: number): Observable<Produto | undefined> {
    const achado = this.produtos.find(p => p.id === id);
    return of(achado ? { ...achado } : undefined).pipe(delay(300));
  }

  // CREATE
  salvar(dados: DadosProduto): Observable<Produto> {
    const novo: Produto = { ...dados, id: this.proximoId() };
    this.produtos.push(novo);
    this.persistir();
    return of({ ...novo }).pipe(delay(400));
  }

  // UPDATE — devolve undefined se o produto não existir.
  atualizar(id: number, dados: Partial<DadosProduto>): Observable<Produto | undefined> {
    const indice = this.produtos.findIndex(p => p.id === id);
    if (indice < 0) return of(undefined).pipe(delay(400));

    const atualizado: Produto = { ...this.produtos[indice], ...dados, id };
    this.produtos[indice] = atualizado;
    this.persistir();
    return of({ ...atualizado }).pipe(delay(400));
  }

  // DELETE — devolve true se algo foi removido.
  excluir(id: number): Observable<boolean> {
    const antes = this.produtos.length;
    this.produtos = this.produtos.filter(p => p.id !== id);
    const removeu = this.produtos.length < antes;
    if (removeu) {
      this.persistir();
      this.avaliacaoService.excluirPorProdutos([id]);
    }
    return of(removeu).pipe(delay(400));
  }

  // Usado quando o vendedor exclui a conta.
  excluirPorVendedor(vendedorId: number): Observable<number> {
    const ids = this.produtos.filter(p => p.vendedorId === vendedorId).map(p => p.id);
    this.produtos = this.produtos.filter(p => p.vendedorId !== vendedorId);
    if (ids.length) {
      this.persistir();
      this.avaliacaoService.excluirPorProdutos(ids);
    }
    const removidos = ids.length;
    return of(removidos).pipe(delay(300));
  }

  // Mantém nome do negócio e telefone dos produtos iguais aos do perfil do vendedor.
  sincronizarVendedor(vendedor: Vendedor): void {
    let mudou = false;
    for (const p of this.produtos) {
      if (p.vendedorId !== vendedor.id) continue;
      p.vendedorNome = vendedor.nomeNegocio || vendedor.nome;
      p.vendedorTelefone = vendedor.telefone;
      mudou = true;
    }
    if (mudou) this.persistir();
  }

  private proximoId(): number {
    return Math.max(0, ...this.produtos.map(p => p.id)) + 1;
  }

  private copiar(lista: Produto[]): Produto[] {
    return lista.map(p => ({ ...p }));
  }

  private carregar(): Produto[] {
    try {
      const texto = sessionStorage.getItem(CHAVE_PRODUTOS);
      if (texto) return JSON.parse(texto);
    } catch {}
    return this.copiar(PRODUTOS_EXEMPLO);
  }

  private persistir(): void {
    try {
      sessionStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(this.produtos));
    } catch {
      // Sem espaço (ex.: muitas fotos) ou storage bloqueado: os dados ficam só na memória.
    }
  }
}
