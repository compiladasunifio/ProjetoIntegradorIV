import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DIAS_SEMANA, HorarioAtendimento } from '../models/horario-atendimento';
import { lerSalvo, proximoId, salvar } from './armazenamento';

const CHAVE_HORARIOS = 'unifood.horarios';

// Horários dos vendedores de exemplo do catálogo
const HORARIOS_EXEMPLO: HorarioAtendimento[] = [
  { id: 1, vendedorId: 1, dia: 'Segunda', inicio: '10:00', fim: '12:00', local: 'Bloco 5' },
  { id: 2, vendedorId: 1, dia: 'Quarta', inicio: '14:00', fim: '16:00', local: 'Biblioteca' },
  { id: 3, vendedorId: 2, dia: 'Terça', inicio: '09:00', fim: '11:00', local: 'Biblioteca' },
  { id: 4, vendedorId: 3, dia: 'Quinta', inicio: '18:30', fim: '20:00', local: 'Bloco 6' },
  { id: 5, vendedorId: 4, dia: 'Segunda', inicio: '11:00', fim: '13:00', local: 'Bloco 2' },
  { id: 6, vendedorId: 4, dia: 'Sexta', inicio: '11:00', fim: '13:00', local: 'Bloco 2' },
];

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private horarios: HorarioAtendimento[] = lerSalvo(CHAVE_HORARIOS, () => [...HORARIOS_EXEMPLO]);

  // Horários do vendedor em ordem de dia da semana e hora.
  listarPorVendedor(vendedorId: number): Observable<HorarioAtendimento[]> {
    const lista = this.horarios
      .filter(h => h.vendedorId === vendedorId)
      .sort((a, b) => DIAS_SEMANA.indexOf(a.dia) - DIAS_SEMANA.indexOf(b.dia) || a.inicio.localeCompare(b.inicio));
    return of(lista).pipe(delay(200));
  }

  criar(dados: Omit<HorarioAtendimento, 'id'>): Observable<void> {
    this.horarios.push({ ...dados, id: proximoId(this.horarios) });
    salvar(CHAVE_HORARIOS, this.horarios);
    return of(undefined).pipe(delay(200));
  }

  atualizar(id: number, dados: Omit<HorarioAtendimento, 'id'>): Observable<void> {
    this.horarios = this.horarios.map(h => (h.id === id ? { ...dados, id } : h));
    salvar(CHAVE_HORARIOS, this.horarios);
    return of(undefined).pipe(delay(200));
  }

  excluir(id: number): Observable<void> {
    this.horarios = this.horarios.filter(h => h.id !== id);
    salvar(CHAVE_HORARIOS, this.horarios);
    return of(undefined).pipe(delay(200));
  }

  // Quando o vendedor exclui a conta, os horários dele vão junto.
  excluirPorVendedor(vendedorId: number): void {
    this.horarios = this.horarios.filter(h => h.vendedorId !== vendedorId);
    salvar(CHAVE_HORARIOS, this.horarios);
  }
}
