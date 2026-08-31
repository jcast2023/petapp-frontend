import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-solicitar-recuperacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitar-recuperacion.html',
  styleUrl: './solicitar-recuperacion.scss'
})
export class SolicitarRecuperacion {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  mensajeExito = '';
  mensajeError = '';

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const email = this.form.value.email;

    this.authService.solicitarRecuperacion(email)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (res: any) => {
          this.mensajeExito = res?.mensaje || res?.message || 'Hemos enviado un enlace de recuperación a tu correo electrónico.';
          this.form.reset();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3500);
        },
        error: (err: any) => {
          this.mensajeError = err.error?.mensaje || err.error?.message || 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.';
        }
      });
  }
}
