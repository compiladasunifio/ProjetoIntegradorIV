import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { Vendedor } from '../models/vendedor';

const CHAVE_SESSAO = 'unifood.vendedor';
const CHAVE_CONTAS = 'unifood.contas';

// SIMULAÇÃO: conta de teste (é a dona do "Brigadeiro gourmet" do catálogo).
const CONTA_DEMO: Vendedor = {
  id: 1,
  nome: 'Isa',
  email: 'isa@gmail.com',
  telefone: '14998453088',
  nomeNegocio: 'Doces da Isa',
  localizacao: 'Bloco 2',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  // SIMULAÇÃO: contas guardadas só neste navegador, sem senha.
  private contas: Vendedor[] = this.carregarContas();
  private readonly _vendedor = signal<Vendedor | null>(this.lerSessao());

  readonly vendedor = this._vendedor.asReadonly();
  readonly logado = computed(() => this._vendedor() !== null);

  // Devolve null se não existir conta com esse e-mail.
  // A senha será conferida pelo back-end; aqui ela é ignorada.
  login(email: string, _senha: string): Observable<Vendedor | null> {
    const alvo = email.trim().toLowerCase();
    const conta = this.contas.find(c => c.email.toLowerCase() === alvo) ?? null;
    return of(conta).pipe(
      delay(400),
      tap(c => { if (c) this.iniciarSessao(c); }),
    );
  }

  // Só cria a conta (não faz login). Devolve null se o e-mail já existe.
  cadastrar(dados: Omit<Vendedor, 'id'>): Observable<Vendedor | null> {
    const alvo = dados.email.trim().toLowerCase();
    if (this.contas.some(c => c.email.toLowerCase() === alvo)) {
      return of(null).pipe(delay(400));
    }
    const nova: Vendedor = { ...dados, id: this.proximoId() };
    this.contas.push(nova);
    this.salvarContas();
    return of(nova).pipe(delay(400));
  }

  logout(): void {
    this._vendedor.set(null);
    try { sessionStorage.removeItem(CHAVE_SESSAO); } catch {}
  }

  private proximoId(): number {
    // 2, 3 e 4 são dos vendedores de exemplo do catálogo
    return Math.max(5, ...this.contas.map(c => c.id + 1));
  }

  private iniciarSessao(vendedor: Vendedor): void {
    this._vendedor.set(vendedor);
    try { sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(vendedor)); } catch {}
  }

  private lerSessao(): Vendedor | null {
    try {
      const salvo = sessionStorage.getItem(CHAVE_SESSAO);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  }

  private carregarContas(): Vendedor[] {
    let salvas: Vendedor[] = [];
    try {
      const texto = sessionStorage.getItem(CHAVE_CONTAS);
      salvas = texto ? JSON.parse(texto) : [];
    } catch {}
    return [CONTA_DEMO, ...salvas.filter(c => c.email !== CONTA_DEMO.email)];
  }

  private salvarContas(): void {
    try { sessionStorage.setItem(CHAVE_CONTAS, JSON.stringify(this.contas)); } catch {}
  }
}