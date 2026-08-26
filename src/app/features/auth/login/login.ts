import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  readonly formulario = this.formBuilder.nonNullable.group({
    correo: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    contrasena: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  iniciarSesion(): void {
    this.mensajeError.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    this.authService
      .login(this.formulario.getRawValue())
      .pipe(
        finalize(() => this.cargando.set(false))
      )
      .subscribe({
        next: () => {
          // El AuthService ya guarda la sesión automáticamente
          this.router.navigateByUrl('/dashboard');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.mensajeError.set('Credenciales inválidas.');
            return;
          }

          this.mensajeError.set('No se pudo conectar con el servidor.');
        }
      });
  }
}
