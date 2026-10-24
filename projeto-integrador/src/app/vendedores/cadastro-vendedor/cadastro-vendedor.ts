import { Component, signal } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cadastro-vendedor',
  standalone: false,
  templateUrl: './cadastro-vendedor.html',
  styleUrl: './cadastro-vendedor.scss',
})
export class CadastroVendedor {
  vendedor = this.novoVendedor();
  mensagem = signal('');

  salvar(form: NgForm): void {
    if (form.invalid) return;
    // SIMULAÇÃO: ainda não há gravação. Aqui entrará a chamada ao serviço.
    this.mensagem.set(`Cadastro de "${this.vendedor.nome.trim()}" validado (simulação, sem gravação).`);
  }

  limpar(form: NgForm): void {
    form.resetForm(this.novoVendedor());
    this.mensagem.set('');
  }

  private novoVendedor() {
    return { nome: '', email: '', senha: '', telefone: '', nomeNegocio: '', localizacao: '' };
  }
}