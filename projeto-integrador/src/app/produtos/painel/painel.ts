import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../shared/services/auth-service';
import { ProdutoService } from '../../shared/services/produto-service';
import { AvaliacaoService, mediaNotas } from '../../shared/services/avaliacao-service';
import { HorarioService } from '../../shared/services/horario-service';

@Component({
  selector: 'app-painel',
  standalone: false,
  templateUrl: './painel.html',
  styleUrl: './painel.scss',
})
export class Painel implements OnInit {
  private auth = inject(AuthService);
  private produtoService = inject(ProdutoService);
  private avaliacaoService = inject(AvaliacaoService);
  private horarioService = inject(HorarioService);

  carregando = signal(true);
  totalProdutos = signal(0);
  produtosDisponiveis = signal(0);
  totalAvaliacoes = signal(0);
  notaMedia = signal<number | null>(null);
  horasSemana = signal(0);

  ngOnInit(): void {
    const vendedorId = this.auth.vendedor()!.id;

    forkJoin({
      produtos: this.produtoService.listarPorVendedor(vendedorId),
      avaliacoes: this.avaliacaoService.listar(),
      horarios: this.horarioService.listarPorVendedor(vendedorId),
    }).subscribe(({ produtos, avaliacoes, horarios }) => {
      // Produtos
      this.totalProdutos.set(produtos.length);
      this.produtosDisponiveis.set(produtos.filter(p => p.disponivel).length);

      // Avaliações dos produtos deste vendedor
      const meusIds = produtos.map(p => p.id);
      const minhasAvaliacoes = avaliacoes.filter(a => meusIds.includes(a.produtoId));
      this.totalAvaliacoes.set(minhasAvaliacoes.length);
      this.notaMedia.set(mediaNotas(minhasAvaliacoes));

      // Soma da duração de cada horário de atendimento, em horas
      const minutos = horarios.reduce((total, h) => total + (emMinutos(h.fim) - emMinutos(h.inicio)), 0);
      this.horasSemana.set(minutos / 60);

      this.carregando.set(false);
    });
  }
}

// "10:30" -> 630
function emMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}
