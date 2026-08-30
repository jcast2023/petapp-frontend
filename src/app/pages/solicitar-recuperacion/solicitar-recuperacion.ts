import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Revisa la ruta exacta de tu AuthService

@Component({
  selector: 'app-solicitar-recuperacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitar-recuperacion.html',
  styleUrl: './solicitar-recuperacion.scss'
})
export class SolicitarRecuperacion {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService); // 1. Inyectamos el servicio

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  loading = false;
  mensajeExito = '';
  mensajeError = '';

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const { email } = this.form.value;

    // 2. Llamada real al backend
    this.authService.solicitarRecuperacion(email).subscribe({
      next: (res) => {
        this.loading = false;
        this.mensajeExito = res.mensaje || 'Hemos enviado un enlace de recuperación a tu correo electrónico.';
      },
      error: (err) => {
        this.loading = false;
        this.mensajeError = err.error?.mensaje || 'Ocurrió un error al procesar la solicitud.';
      }
    });
  }
}
