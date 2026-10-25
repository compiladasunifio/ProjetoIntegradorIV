import { Component, OnInit, inject, signal } from '@angular/core';
import { Produto } from '../../shared/models/produto';
import { ProdutoService } from '../../shared/services/produto-service';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-meus-produtos',
  standalone: false,
  templateUrl: './meus-produtos.html',
  styleUrl: './meus-produtos.scss',
})
export class MeusProdutos implements OnInit {
  private produtoService = inject(ProdutoService);
  private auth = inject(AuthService);

  produtos = signal<Produto[]>([]);
  carregando = signal(true);

  ngOnInit(): void {
    this.produtoService.listarPorVendedor(this.auth.vendedor()!.id).subscribe(lista => {
      this.produtos.set(lista);
      this.carregando.set(false);
    });
  }
}