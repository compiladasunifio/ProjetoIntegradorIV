import { Injectable, computed, signal } from '@angular/core';
import { Observable, from, of, delay, map, tap } from 'rxjs';
import { Vendedor } from '../models/vendedor';

const CHAVE_SESSAO = 'unifood.vendedor';
const CHAVE_CONTAS = 'unifood.contas';

// Conta como fica guardada: os dados do vendedor + a senha em forma de hash.
// A senha em si nunca é guardada, só o hash SHA-256 de (sal + senha).
interface Conta extends Vendedor {
  sal: string;
  senhaHash: string;
}

// SIMULAÇÃO: conta de teste (é a dona do "Brigadeiro gourmet" do catálogo).
// Senha: 123456
const CONTA_DEMO: Conta = {
  id: 1,
  nome: 'Isa',
  email: 'isa@gmail.com',
  telefone: '14998453088',
  nomeNegocio: 'Doces da Isa',
  localizacao: 'Bloco 2',
  sal: 'demo-isa',
  senhaHash: 'cac2faffd9270c115d251bf32c888c2706690ae83cb86d5e75bde23d1804c384',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  // SIMULAÇÃO: contas guardadas só neste navegador. Quando houver back-end,
  // a conferência da senha deve acontecer lá, não aqui.
  private contas: Conta[] = this.carregarContas();
  private readonly _vendedor = signal<Vendedor | null>(this.lerSessao());

  readonly vendedor = this._vendedor.asReadonly();
  readonly logado = computed(() => this._vendedor() !== null);

  // Devolve null se o e-mail não existir ou se a senha estiver errada.
  login(email: string, senha: string): Observable<Vendedor | null> {
    const alvo = email.trim().toLowerCase();
    const conta = this.contas.find(c => c.email.toLowerCase() === alvo);

    // Mesmo sem conta, calcula um hash para a resposta demorar o mesmo tempo.
    return from(gerarHash(conta?.sal ?? 'sem-conta', senha)).pipe(
      map(hash => (conta && conta.senhaHash && hash === conta.senhaHash ? semSenha(conta) : null)),
      delay(400),
      tap(v => { if (v) this.iniciarSessao(v); }),
    );
  }

  // Só cria a conta (não faz login). Devolve null se o e-mail já existe.
  cadastrar(dados: Omit<Vendedor, 'id'>, senha: string): Observable<Vendedor | null> {
    const alvo = dados.email.trim().toLowerCase();
    if (this.contas.some(c => c.email.toLowerCase() === alvo)) {
      return of(null).pipe(delay(400));
    }

    const sal = gerarSal();
    return from(gerarHash(sal, senha)).pipe(
      map(senhaHash => {
        const nova: Conta = { ...dados, id: this.proximoId(), sal, senhaHash };
        this.contas.push(nova);
        this.salvarContas();
        return semSenha(nova);
      }),
      delay(400),
    );
  }

  // UPDATE: altera os dados da conta logada (a senha continua a mesma).
  // Devolve null se o novo e-mail já for de outra conta.
  atualizar(dados: Omit<Vendedor, 'id'>): Observable<Vendedor | null> {
    const atual = this._vendedor();
    const conta = atual && this.contas.find(c => c.id === atual.id);
    if (!conta) return of(null).pipe(delay(400));

    const alvo = dados.email.trim().toLowerCase();
    if (this.contas.some(c => c.id !== conta.id && c.email.toLowerCase() === alvo)) {
      return of(null).pipe(delay(400));
    }

    const atualizada: Conta = { ...conta, ...dados, id: conta.id };
    this.contas = this.contas.map(c => (c.id === conta.id ? atualizada : c));
    this.salvarContas();
    const vendedor = semSenha(atualizada);
    this.iniciarSessao(vendedor);
    return of(vendedor).pipe(delay(400));
  }

  // Troca a senha da conta logada. Devolve false se a senha atual estiver errada.
  alterarSenha(senhaAtual: string, novaSenha: string): Observable<boolean> {
    const atual = this._vendedor();
    const conta = atual && this.contas.find(c => c.id === atual.id);
    if (!conta) return of(false).pipe(delay(400));

    return from(this.trocarHash(conta, senhaAtual, novaSenha)).pipe(delay(400));
  }

  private async trocarHash(conta: Conta, senhaAtual: string, novaSenha: string): Promise<boolean> {
    if (!conta.senhaHash || (await gerarHash(conta.sal, senhaAtual)) !== conta.senhaHash) {
      return false;
    }
    // Um sal novo a cada troca de senha.
    const sal = gerarSal();
    const senhaHash = await gerarHash(sal, novaSenha);
    this.contas = this.contas.map(c => (c.id === conta.id ? { ...c, sal, senhaHash } : c));
    this.salvarContas();
    return true;
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

  private carregarContas(): Conta[] {
    let salvas: Conta[] = [];
    let texto: string | null = null;
    try {
      texto = sessionStorage.getItem(CHAVE_CONTAS);
      salvas = texto ? JSON.parse(texto) : [];
    } catch {}
    // Depois do primeiro salvamento, a lista salva já inclui (ou não, se foi excluída) a conta de teste.
    if (texto !== null) return salvas;
    return [{ ...CONTA_DEMO }];
  }

  private salvarContas(): void {
    try { sessionStorage.setItem(CHAVE_CONTAS, JSON.stringify(this.contas)); } catch {}
  }
}

// Tira sal e hash antes de expor a conta para o resto do app.
function semSenha({ sal: _sal, senhaHash: _hash, ...vendedor }: Conta): Vendedor {
  return vendedor;
}

function gerarSal(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return paraHex(bytes);
}

async function gerarHash(sal: string, senha: string): Promise<string> {
  const dados = new TextEncoder().encode(sal + senha);
  const resumo = await crypto.subtle.digest('SHA-256', dados);
  return paraHex(new Uint8Array(resumo));
}

function paraHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
