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
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  readonly formulario = this.formBuilder.nonNullable.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],
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

  crearCuenta(): void {
    this.mensajeError.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    this.authService
      .registrar(this.formulario.getRawValue())
      .pipe(
        finalize(() => this.cargando.set(false))
      )
      .subscribe({
        next: () => {
          // El AuthService ya guarda la sesión automáticamente
          this.router.navigateByUrl('/dashboard');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.mensajeError.set('El correo ya está registrado.');
            return;
          }

          this.mensajeError.set('No se pudo crear la cuenta.');
        }
      });
  }
}
