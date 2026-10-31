import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../../shared/models/produto';
import { ProdutoService } from '../../shared/services/produto-service';

@Component({
  selector: 'app-detalhe-produto',
  standalone: false,
  templateUrl: './detalhe-produto.html',
  styleUrl: './detalhe-produto.scss',
})
export class DetalheProduto implements OnInit {
  private route = inject(ActivatedRoute);
  private produtoService = inject(ProdutoService);

  produto = signal<Produto | undefined>(undefined);
  carregando = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.produtoService.obterPorId(id).subscribe(p => {
      this.produto.set(p);
      this.carregando.set(false);
    });
  }

  linkWhatsapp(p: Produto): string {
    const numero = (p.vendedorTelefone ?? '').replace(/\D/g, '');
    const mensagem = encodeURIComponent(`Olá! Vi o produto "${p.nome}" no UniFood e tenho interesse.`);
    return `https://wa.me/55${numero}?text=${mensagem}`;
  }
}