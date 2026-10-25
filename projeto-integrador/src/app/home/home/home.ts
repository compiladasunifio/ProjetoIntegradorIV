import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  passos = [
    { titulo: '1. O vendedor se cadastra', texto: 'Alunos empreendedores criam o perfil e informam onde encontrá-los na faculdade.' },
    { titulo: '2. Divulga seus produtos', texto: 'Cada vendedor cadastra e atualiza seus produtos sozinho, sem depender de um administrador.' },
    { titulo: '3. O comprador encontra e contata', texto: 'A comunidade acadêmica consulta o catálogo e combina a compra direto com o vendedor.' },
  ];
}