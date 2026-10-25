import { Component, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  credenciais = { email: '', senha: '' };
  mensagem = signal('');
  entrando = signal(false);

  entrar(form: NgForm): void {
    if (form.invalid || this.entrando()) return;

    this.entrando.set(true);
    this.auth.login(this.credenciais.email.trim(), this.credenciais.senha).subscribe(() => {
      this.entrando.set(false);
      this.router.navigateByUrl('/produtos/meus-produtos');
    });
  }
}