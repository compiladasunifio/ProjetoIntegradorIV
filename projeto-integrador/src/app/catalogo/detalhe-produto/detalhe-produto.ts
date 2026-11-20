import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../../shared/models/produto';
import { ProdutoService } from '../../shared/services/produto-service';
import { HorarioService } from '../../shared/services/horario-service';
import { HorarioAtendimento } from '../../shared/models/horario-atendimento';

@Component({
  selector: 'app-detalhe-produto',
  standalone: false,
  templateUrl: './detalhe-produto.html',
  styleUrl: './detalhe-produto.scss',
})
export class DetalheProduto implements OnInit {
  private route = inject(ActivatedRoute);
  private produtoService = inject(ProdutoService);
  private horarioService = inject(HorarioService);

  produto = signal<Produto | undefined>(undefined);
  carregando = signal(true);
  horarios = signal<HorarioAtendimento[]>([]);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.produtoService.obterPorId(id).subscribe(p => {
      this.produto.set(p);
      this.carregando.set(false);
      if (p) this.horarioService.listarPorVendedor(p.vendedorId).subscribe(lista => this.horarios.set(lista));
    });
  }

  linkWhatsapp(p: Produto): string {
    const numero = (p.vendedorTelefone ?? '').replace(/\D/g, '');
    const mensagem = encodeURIComponent(`Olá! Vi o produto "${p.nome}" no UniFood e tenho interesse.`);
    return `https://wa.me/55${numero}?text=${mensagem}`;
  }
}