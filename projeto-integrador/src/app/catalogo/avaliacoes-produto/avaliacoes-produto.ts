import { Component, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Avaliacao } from '../../shared/models/avaliacao';
import { Produto } from '../../shared/models/produto';
import { AuthService } from '../../shared/services/auth-service';
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
  private auth = inject(AuthService);

  produto = input.required<Produto>();
  private formRef = viewChild<NgForm>('f');

  avaliacoes = signal<Avaliacao[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  editandoId = signal<number | null>(null); // avaliação sendo editada pelo autor
  respondendoId = signal<number | null>(null); // avaliação sendo respondida pelo vendedor
  mensagem = signal('');
  erroNota = signal(false);

  form = this.vazia();
  resposta = '';

  media = computed(() => mediaNotas(this.avaliacoes()));
  // Quantas avaliações de cada nota, da 5 para a 1
  distribuicao = computed(() =>
    [5, 4, 3, 2, 1].map(nota => {
      const qtd = this.avaliacoes().filter(a => a.nota === nota).length;
      return { nota, qtd, pct: this.avaliacoes().length ? (qtd / this.avaliacoes().length) * 100 : 0 };
    }),
  );
  ehDono = computed(() => this.auth.vendedor()?.id === this.produto().vendedorId);

  ngOnInit(): void {
    this.recarregar();
  }

  ehMinha(a: Avaliacao): boolean {
    return this.avaliacaoService.ehMinha(a.id);
  }

  enviar(f: NgForm): void {
    if (!this.form.nota) this.erroNota.set(true);
    if (f.invalid || !this.form.nota || this.salvando()) return;

    const dados = {
      autorNome: this.form.autorNome.trim(),
      nota: this.form.nota,
      comentario: this.form.comentario.trim(),
    };
    const id = this.editandoId();
    this.salvando.set(true);
    this.mensagem.set('');

    const pedido = id === null
      ? this.avaliacaoService.criar({ ...dados, produtoId: this.produto().id })
      : this.avaliacaoService.atualizar(id, dados);

    pedido.subscribe(salva => {
      this.salvando.set(false);
      this.mensagem.set(!salva ? 'Não foi possível salvar a avaliação.'
        : id === null ? 'Obrigado! Sua avaliação foi publicada.' : 'Avaliação atualizada.');
      this.cancelarEdicao();
      this.recarregar();
    });
  }

  editar(a: Avaliacao): void {
    this.editandoId.set(a.id);
    this.form = { autorNome: a.autorNome, nota: a.nota, comentario: a.comentario };
    this.formRef()?.resetForm(this.form);
    this.erroNota.set(false);
    this.mensagem.set('');
    document.getElementById('form-avaliacao')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  cancelarEdicao(): void {
    this.editandoId.set(null);
    this.form = this.vazia();
    this.formRef()?.resetForm(this.form);
    this.erroNota.set(false);
  }

  escolherNota(nota: number): void {
    this.form.nota = nota;
    this.erroNota.set(false);
  }

  excluir(a: Avaliacao): void {
    const quem = this.ehMinha(a) ? 'sua avaliação' : `a avaliação de ${a.autorNome}`;
    if (!confirm(`Excluir ${quem}?`)) return;
    this.avaliacaoService.excluir(a.id).subscribe(() => {
      this.mensagem.set('Avaliação excluída.');
      this.recarregar();
    });
  }

  abrirResposta(a: Avaliacao): void {
    this.respondendoId.set(a.id);
    this.resposta = a.resposta ?? '';
  }

  salvarResposta(a: Avaliacao): void {
    this.avaliacaoService.responder(a.id, this.resposta).subscribe(() => {
      this.respondendoId.set(null);
      this.recarregar();
    });
  }

  private recarregar(): void {
    this.avaliacaoService.listarPorProduto(this.produto().id).subscribe(lista => {
      this.avaliacoes.set(lista);
      this.carregando.set(false);
    });
  }

  private vazia() {
    return { autorNome: '', nota: 0, comentario: '' };
  }
}
