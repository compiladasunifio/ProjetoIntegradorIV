import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Avaliacao } from '../../shared/models/avaliacao';
import { AvaliacaoService, mediaNotas } from '../../shared/services/avaliacao-service';

// Seção de avaliações na página de detalhe do produto.
@Component({
  selector: 'app-avaliacoes-produto',
  standalone: false,
  templateUrl: './avaliacoes-produto.html',
  styleUrl: './avaliacoes-produto.scss',
})
export class AvaliacoesProduto implements OnInit {
  private avaliacaoService = inject(AvaliacaoService);

  produtoId = input.required<number>();

  avaliacoes = signal<Avaliacao[]>([]);
  media = computed(() => mediaNotas(this.avaliacoes()));
  editandoId: number | null = null;
  mensagem = signal('');

  form = { autorNome: '', nota: 0, comentario: '' };

  ngOnInit(): void {
    this.carregar();
  }

  ehMinha(a: Avaliacao): boolean {
    return this.avaliacaoService.ehMinha(a.id);
  }

  salvar(): void {
    if (!this.form.nota) {
      this.mensagem.set('Escolha uma nota de 1 a 5.');
      return;
    }
    if (!this.form.autorNome.trim() || !this.form.comentario.trim()) return;

    const dados = {
      autorNome: this.form.autorNome.trim(),
      nota: this.form.nota,
      comentario: this.form.comentario.trim(),
    };
    const acao = this.editandoId === null
      ? this.avaliacaoService.criar({ ...dados, produtoId: this.produtoId() })
      : this.avaliacaoService.atualizar(this.editandoId, dados);

    acao.subscribe(() => {
      this.mensagem.set(this.editandoId === null ? 'Avaliação publicada.' : 'Avaliação atualizada.');
      this.cancelar();
      this.carregar();
    });
  }

  editar(a: Avaliacao): void {
    this.editandoId = a.id;
    this.form = { autorNome: a.autorNome, nota: a.nota, comentario: a.comentario };
    this.mensagem.set('');
  }

  cancelar(): void {
    this.editandoId = null;
    this.form = { autorNome: '', nota: 0, comentario: '' };
  }

  excluir(a: Avaliacao): void {
    if (!confirm('Excluir sua avaliação?')) return;
    this.avaliacaoService.excluir(a.id).subscribe(() => {
      this.mensagem.set('Avaliação excluída.');
      this.carregar();
    });
  }

  private carregar(): void {
    this.avaliacaoService.listarPorProduto(this.produtoId()).subscribe(lista => this.avaliacoes.set(lista));
  }
}
