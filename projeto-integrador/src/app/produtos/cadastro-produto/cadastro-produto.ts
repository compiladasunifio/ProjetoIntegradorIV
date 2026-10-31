import { Component, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/services/auth-service';
import { ProdutoService } from '../../shared/services/produto-service';

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5 MB

@Component({
  selector: 'app-cadastro-produto',
  standalone: false,
  templateUrl: './cadastro-produto.html',
  styleUrl: './cadastro-produto.scss',
})
export class CadastroProduto {
  private produtoService = inject(ProdutoService);
  private auth = inject(AuthService);

  produto = this.novoProduto();
  previa = signal('');
  erroImagem = signal('');
  mensagem = signal('');
  salvando = signal(false);

  async escolherFoto(evento: Event): Promise<void> {
    const campo = evento.target as HTMLInputElement;
    const arquivo = campo.files?.[0];
    campo.value = ''; 
    if (!arquivo) return;

    this.erroImagem.set('');

    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      this.erroImagem.set('Use uma imagem JPG, PNG ou WebP.');
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      this.erroImagem.set('A imagem é grande demais. Use uma de até 5 MB.');
      return;
    }

    try {
      this.previa.set(await this.reduzir(arquivo));
    } catch {
      this.erroImagem.set('Não foi possível ler essa imagem. Tente outra.');
    }
  }

  removerFoto(): void {
    this.previa.set('');
    this.erroImagem.set('');
  }

  salvar(form: NgForm): void {
    if (form.invalid || this.salvando()) return;

    const vendedor = this.auth.vendedor()!;
    this.salvando.set(true);
    this.mensagem.set('');

    this.produtoService
      .salvar({
        nome: this.produto.nome.trim(),
        descricao: this.produto.descricao.trim(),
        preco: this.produto.preco ?? 0,
        imagemUrl: this.previa(),
        disponivel: this.produto.disponivel,
        localizacao: this.produto.localizacao.trim(),
        vendedorId: vendedor.id,
        vendedorNome: vendedor.nomeNegocio || vendedor.nome,
        vendedorTelefone: vendedor.telefone,
      })
      .subscribe(salvo => {
        this.salvando.set(false);
        this.mensagem.set(`Produto "${salvo.nome}" cadastrado (dados simulados, sem banco).`);
        this.previa.set('');
        form.resetForm(this.novoProduto());
      });
  }

  limpar(form: NgForm): void {
    form.resetForm(this.novoProduto());
    this.previa.set('');
    this.erroImagem.set('');
    this.mensagem.set('');
  }

  private async reduzir(arquivo: File, ladoMaximo = 800): Promise<string> {
    const imagem = await createImageBitmap(arquivo);
    const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height));

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(imagem.width * escala);
    canvas.height = Math.round(imagem.height * escala);

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff'; // fundo branco para PNGs com transparência
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);
    imagem.close();

    return canvas.toDataURL('image/jpeg', 0.8);
  }

  private novoProduto() {
    return {
      nome: '',
      descricao: '',
      preco: null as number | null,
      disponivel: true,
      localizacao: '',
    };
  }
}