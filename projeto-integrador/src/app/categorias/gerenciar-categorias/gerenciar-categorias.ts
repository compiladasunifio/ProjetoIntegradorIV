import { Component, OnInit, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Categoria } from '../../shared/models/categoria';
import { CategoriaService, ICONES_CATEGORIA } from '../../shared/services/categoria-service';
import { ProdutoService } from '../../shared/services/produto-service';

@Component({
  selector: 'app-gerenciar-categorias',
  standalone: false,
  templateUrl: './gerenciar-categorias.html',
  styleUrl: './gerenciar-categorias.scss',
})
export class GerenciarCategorias implements OnInit {
  private categoriaService = inject(CategoriaService);
  private produtoService = inject(ProdutoService);

  readonly icones = ICONES_CATEGORIA;

  categorias = signal<Categoria[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  editandoId = signal<number | null>(null);
  mensagem = signal('');
  erro = signal('');

  dados = this.vazia();

  ngOnInit(): void {
    this.recarregar();
  }

  totalProdutos(id: number): number {
    return this.produtoService.contarPorCategoria(id);
  }

  editar(c: Categoria, form: NgForm): void {
    this.editandoId.set(c.id);
    form.resetForm({ nome: c.nome, icone: c.icone });
    this.dados = { nome: c.nome, icone: c.icone };
    this.mensagem.set('');
    this.erro.set('');
  }

  cancelar(form: NgForm): void {
    this.editandoId.set(null);
    form.resetForm(this.vazia());
    this.dados = this.vazia();
    this.erro.set('');
  }

  salvar(form: NgForm): void {
    if (form.invalid || this.salvando()) return;

    const id = this.editandoId();
    const dados = { nome: this.dados.nome.trim(), icone: this.dados.icone };
    this.salvando.set(true);
    this.erro.set('');
    this.mensagem.set('');

    const pedido = id === null
      ? this.categoriaService.salvar(dados)
      : this.categoriaService.atualizar(id, dados);

    pedido.subscribe(salva => {
      this.salvando.set(false);
      if (!salva) {
        this.erro.set(`Já existe uma categoria chamada "${dados.nome}".`);
        return;
      }
      this.mensagem.set(id === null ? `Categoria "${salva.nome}" criada.` : `Categoria "${salva.nome}" atualizada.`);
      this.cancelar(form);
      this.recarregar();
    });
  }

  excluir(c: Categoria): void {
    if (!confirm(`Excluir a categoria "${c.nome}"?`)) return;

    this.mensagem.set('');
    this.erro.set('');
    this.categoriaService.excluir(c.id).subscribe(resultado => {
      if (resultado === 'em-uso') {
        const n = this.totalProdutos(c.id);
        this.erro.set(`"${c.nome}" ainda tem ${n} produto${n > 1 ? 's' : ''}. Mude ${n > 1 ? 'esses produtos' : 'esse produto'} de categoria antes de excluir.`);
        return;
      }
      if (this.editandoId() === c.id) this.editandoId.set(null);
      this.mensagem.set(`Categoria "${c.nome}" excluída.`);
      this.recarregar();
    });
  }

  private recarregar(): void {
    this.categoriaService.listar().subscribe(lista => {
      this.categorias.set(lista);
      this.carregando.set(false);
    });
  }

  private vazia() {
    return { nome: '', icone: 'restaurant' };
  }
}
