import { Component, signal } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  credenciais = { email: '', senha: '' };
  mensagem = signal('');

  entrar(form: NgForm): void {
    if (form.invalid) return;
    // SIMULAÇÃO: sem autenticação real. Aqui entrará a chamada ao serviço de login.
    this.mensagem.set(`Login de "${this.credenciais.email.trim()}" validado (simulação, sem autenticação).`);
  }
}