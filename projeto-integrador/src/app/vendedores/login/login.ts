import { Component, OnInit, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  credenciais = { email: '', senha: '' };
  aviso = signal('');
  mensagem = signal('');
  entrando = signal(false);

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('cadastro') === 'ok') {
      this.aviso.set('Conta criada com sucesso! Entre com o seu e-mail e a sua senha.');
    }
  }

  entrar(form: NgForm): void {
    if (form.invalid || this.entrando()) return;

    this.entrando.set(true);
    this.mensagem.set('');

    this.auth.login(this.credenciais.email, this.credenciais.senha).subscribe(vendedor => {
      this.entrando.set(false);
      if (!vendedor) {
        this.aviso.set('');
        this.mensagem.set('Não encontramos uma conta com esse e-mail. Confira o endereço ou crie uma conta.');
        return;
      }
      this.router.navigateByUrl('/produtos/meus-produtos');
    });
  }
}