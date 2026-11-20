import { Component, OnInit, inject, signal } from '@angular/core';
import { Categoria } from '../../shared/models/categoria';
import { CategoriaService } from '../../shared/services/categoria-service';

@Component({
  selector: 'app-gerenciar-categorias',
  standalone: false,
  templateUrl: './gerenciar-categorias.html',
  styleUrl: './gerenciar-categorias.scss',
})
export class GerenciarCategorias implements OnInit {
  private categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);
  nome = '';
  editandoId: number | null = null;
  mensagem = signal('');

  ngOnInit(): void {
    this.carregar();
  }

  salvar(): void {
    const nome = this.nome.trim();
    if (!nome) return;

    const acao = this.editandoId === null
      ? this.categoriaService.salvar(nome)
      : this.categoriaService.atualizar(this.editandoId, nome);

    acao.subscribe(() => {
      this.mensagem.set(this.editandoId === null ? 'Categoria adicionada.' : 'Categoria atualizada.');
      this.cancelar();
      this.carregar();
    });
  }

  editar(c: Categoria): void {
    this.editandoId = c.id;
    this.nome = c.nome;
    this.mensagem.set('');
  }

  cancelar(): void {
    this.editandoId = null;
    this.nome = '';
  }

  excluir(c: Categoria): void {
    if (!confirm(`Excluir a categoria "${c.nome}"?`)) return;

    this.categoriaService.excluir(c.id).subscribe(excluiu => {
      if (excluiu) {
        this.mensagem.set('Categoria excluída.');
        this.carregar();
      } else {
        this.mensagem.set(`Não é possível excluir "${c.nome}" porque ainda há produtos nela.`);
      }
    });
  }

  private carregar(): void {
    this.categoriaService.listar().subscribe(lista => this.categorias.set(lista));
  }
}
