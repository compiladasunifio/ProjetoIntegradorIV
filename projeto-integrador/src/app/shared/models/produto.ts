export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  disponivel: boolean;
  localizacao: string;
  vendedorId: number;
}