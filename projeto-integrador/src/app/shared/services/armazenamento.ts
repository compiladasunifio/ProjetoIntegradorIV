// SIMULAÇÃO: enquanto não há back-end, os dados ficam no sessionStorage deste navegador.

// Devolve o valor salvo na chave, ou `padrao` se não houver nada (ou se o storage estiver bloqueado).
export function lerSalvo<T>(chave: string, padrao: () => T): T {
  try {
    const texto = sessionStorage.getItem(chave);
    if (texto !== null) return JSON.parse(texto) as T;
  } catch {}
  return padrao();
}

export function salvar(chave: string, valor: unknown): void {
  try {
    sessionStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Sem espaço ou storage bloqueado: os dados ficam só na memória.
  }
}

export function proximoId(lista: { id: number }[]): number {
  return Math.max(0, ...lista.map(x => x.id)) + 1;
}
