import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DIAS_SEMANA, HorarioAtendimento } from '../../shared/models/horario-atendimento';
import { HorarioService } from '../../shared/services/horario-service';

// Seção "Horários de atendimento" da página Meu perfil.
@Component({
  selector: 'app-horarios-atendimento',
  standalone: false,
  templateUrl: './horarios-atendimento.html',
  styleUrl: './horarios-atendimento.scss',
})
export class HorariosAtendimento implements OnInit {
  private horarioService = inject(HorarioService);

  vendedorId = input.required<number>();

  readonly dias = DIAS_SEMANA;
  horarios = signal<HorarioAtendimento[]>([]);
  editandoId: number | null = null;
  mensagem = signal('');

  form = this.vazio();

  ngOnInit(): void {
    this.carregar();
  }

  salvar(): void {
    const { dia, inicio, fim } = this.form;
    const local = this.form.local.trim();
    if (!dia || !inicio || !fim || !local) {
      this.mensagem.set('Preencha todos os campos.');
      return;
    }
    if (fim <= inicio) {
      this.mensagem.set('O horário de fim deve ser depois do início.');
      return;
    }

    const dados = { vendedorId: this.vendedorId(), dia, inicio, fim, local };
    const acao = this.editandoId === null
      ? this.horarioService.criar(dados)
      : this.horarioService.atualizar(this.editandoId, dados);

    acao.subscribe(() => {
      this.mensagem.set(this.editandoId === null ? 'Horário adicionado.' : 'Horário atualizado.');
      this.cancelar();
      this.carregar();
    });
  }

  editar(h: HorarioAtendimento): void {
    this.editandoId = h.id;
    this.form = { dia: h.dia, inicio: h.inicio, fim: h.fim, local: h.local };
    this.mensagem.set('');
  }

  cancelar(): void {
    this.editandoId = null;
    this.form = this.vazio();
  }

  excluir(h: HorarioAtendimento): void {
    if (!confirm(`Excluir o horário de ${h.dia}, ${h.inicio} às ${h.fim}?`)) return;
    this.horarioService.excluir(h.id).subscribe(() => {
      this.mensagem.set('Horário excluído.');
      if (this.editandoId === h.id) this.cancelar();
      this.carregar();
    });
  }

  private carregar(): void {
    this.horarioService.listarPorVendedor(this.vendedorId()).subscribe(lista => this.horarios.set(lista));
  }

  private vazio() {
    return { dia: '', inicio: '', fim: '', local: '' };
  }
}
