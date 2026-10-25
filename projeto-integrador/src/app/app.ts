import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth-service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('projeto-integrador');
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  sair(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}