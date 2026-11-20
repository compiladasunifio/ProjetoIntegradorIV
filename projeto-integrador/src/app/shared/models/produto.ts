export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  disponivel: boolean;
  localizacao: string;
  vendedorId: number;
  categoriaId: number | null;
  categoriaNome?: string;
  vendedorNome?: string;
  vendedorTelefone?: string;
}
