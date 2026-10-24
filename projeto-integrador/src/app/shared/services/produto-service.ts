import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Produto } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private produtos: Produto[] = [
    {
      id: 1, nome: 'Brigadeiro gourmet', descricao: 'Caixa com 6 unidades',
      preco: 12, imagemUrl: '', disponivel: true,
      localizacao: 'Bloco A, perto da cantina', vendedorId: 1,
    },
  ];

  listar(): Observable<Produto[]> {
    return of([...this.produtos]).pipe(delay(300));
  }

  salvar(dados: Omit<Produto, 'id'>): Observable<Produto> {
    const novo: Produto = { ...dados, id: this.produtos.length + 1 };
    this.produtos.push(novo);
    return of(novo).pipe(delay(400));
  }
}