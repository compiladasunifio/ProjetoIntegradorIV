import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { Vendedor } from '../models/vendedor';

const CHAVE = 'unifood.vendedor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _vendedor = signal<Vendedor | null>(this.restaurar());

  readonly vendedor = this._vendedor.asReadonly();
  readonly logado = computed(() => this._vendedor() !== null);

  // SIMULAÇÃO: aceita qualquer e-mail/senha válidos. Será trocado pela API do Spring.
  login(email: string, _senha: string): Observable<Vendedor> {
    const vendedor: Vendedor = {
      id: 1,
      nome: email.split('@')[0],
      email,
      telefone: '',
      nomeNegocio: '',
      localizacao: '',
    };
    return of(vendedor).pipe(delay(400), tap(v => this.iniciarSessao(v)));
  }

  // SIMULAÇÃO: o cadastro já deixa o vendedor logado.
  cadastrar(dados: Omit<Vendedor, 'id'>): Observable<Vendedor> {
    const vendedor: Vendedor = { ...dados, id: 1 };
    return of(vendedor).pipe(delay(400), tap(v => this.iniciarSessao(v)));
  }

  logout(): void {
    this._vendedor.set(null);
    try { sessionStorage.removeItem(CHAVE); } catch {}
  }

  private iniciarSessao(vendedor: Vendedor): void {
    this._vendedor.set(vendedor);
    try { sessionStorage.setItem(CHAVE, JSON.stringify(vendedor)); } catch {}
  }

  private restaurar(): Vendedor | null {
    try {
      const salvo = sessionStorage.getItem(CHAVE);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  }
}