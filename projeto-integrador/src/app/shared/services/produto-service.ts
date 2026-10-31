import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Produto } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private produtos: Produto[] = [
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

  listar(): Observable<Produto[]> {
    return of([...this.produtos]).pipe(delay(300));
  }

  listarPorVendedor(vendedorId: number): Observable<Produto[]> {
    return of(this.produtos.filter(p => p.vendedorId === vendedorId)).pipe(delay(300));
  }

  obterPorId(id: number): Observable<Produto | undefined> {
    return of(this.produtos.find(p => p.id === id)).pipe(delay(300));
  }

  salvar(dados: Omit<Produto, 'id'>): Observable<Produto> {
    const novo: Produto = { ...dados, id: this.produtos.length + 1 };
    this.produtos.push(novo);
    return of(novo).pipe(delay(400));
  }
}