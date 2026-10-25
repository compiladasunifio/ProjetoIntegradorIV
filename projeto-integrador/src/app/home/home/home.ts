import { Component, OnInit, inject, signal } from '@angular/core';
import { Produto } from '../../shared/models/produto';
import { ProdutoService } from '../../shared/services/produto-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private produtoService = inject(ProdutoService);

  destaques = signal<Produto[]>([]);

  beneficios = [
    { icone: 'storefront', titulo: 'Vendedores da faculdade', texto: 'Alunos que empreendem dentro do campus.' },
    { icone: 'location_on', titulo: 'Fácil de encontrar', texto: 'Cada vendedor informa onde está na faculdade.' },
    { icone: 'chat', titulo: 'Contato direto', texto: 'Combine a compra sem intermediários.' },
  ];

  passos = [
    { titulo: 'O vendedor se cadastra', texto: 'Cria o perfil e informa onde encontrá-lo na faculdade.' },
    { titulo: 'Divulga seus produtos', texto: 'Cadastra e atualiza tudo sozinho, sem depender de um administrador.' },
    { titulo: 'O comprador encontra e contata', texto: 'Consulta o catálogo e combina a compra direto com o vendedor.' },
  ];

  ngOnInit(): void {
    this.produtoService.listar().subscribe(lista => this.destaques.set(lista.slice(0, 3)));
  }
}