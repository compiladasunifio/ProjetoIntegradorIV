import { Component, computed, input, model } from '@angular/core';

// Mostra uma nota de 0 a 5 em estrelas. Com [editavel]="true", vira um seletor de nota.
@Component({
  selector: 'app-estrelas',
  standalone: false,
  templateUrl: './estrelas.html',
  styleUrl: './estrelas.scss',
})
export class Estrelas {
  nota = model(0);
  editavel = input(false);

  protected readonly posicoes = [1, 2, 3, 4, 5];

  // 'star', 'star_half' ou 'star_border' para cada posição
  protected readonly icones = computed(() =>
    this.posicoes.map(i => {
      const n = this.nota();
      if (n >= i) return 'star';
      if (!this.editavel() && n >= i - 0.5) return 'star_half';
      return 'star_border';
    }),
  );

  protected escolher(valor: number): void {
    if (this.editavel()) this.nota.set(valor);
  }
}
