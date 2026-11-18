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

  // UPDATE: altera os dados da conta logada. Devolve null se o novo e-mail já for de outra conta.
  atualizar(dados: Omit<Vendedor, 'id'>): Observable<Vendedor | null> {
    const atual = this._vendedor();
    if (!atual) return of(null).pipe(delay(400));

    const alvo = dados.email.trim().toLowerCase();
    if (this.contas.some(c => c.id !== atual.id && c.email.toLowerCase() === alvo)) {
      return of(null).pipe(delay(400));
    }

    const atualizado: Vendedor = { ...dados, id: atual.id };
    this.contas = this.contas.map(c => (c.id === atual.id ? atualizado : c));
    this.salvarContas();
    this.iniciarSessao(atualizado);
    return of(atualizado).pipe(delay(400));
  }

  // DELETE: remove a conta logada e encerra a sessão.
  excluirConta(): Observable<boolean> {
    const atual = this._vendedor();
    if (!atual) return of(false).pipe(delay(400));

    this.contas = this.contas.filter(c => c.id !== atual.id);
    this.salvarContas();
    this.logout();
    return of(true).pipe(delay(400));
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
    let texto: string | null = null;
    try {
      texto = sessionStorage.getItem(CHAVE_CONTAS);
      salvas = texto ? JSON.parse(texto) : [];
    } catch {}
    // Depois do primeiro salvamento, a lista salva já inclui (ou não, se foi excluída) a conta de teste.
    if (texto !== null) return salvas;
    return [CONTA_DEMO];
  }

  private salvarContas(): void {
    try { sessionStorage.setItem(CHAVE_CONTAS, JSON.stringify(this.contas)); } catch {}
  }
}