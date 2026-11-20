export interface Avaliacao {
  id: number;
  produtoId: number;
  autorNome: string;
  nota: number; // 1 a 5
  comentario: string;
  data: string;
}
