import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solicitar-recuperacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitar-recuperacion.html',
  styleUrl: './solicitar-recuperacion.scss'
})
export class SolicitarRecuperacion {
  private fb = inject(FormBuilder);

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

    // TODO: Conectar con tu servicio AuthService para enviar el correo
    console.log('Solicitando recuperación para:', email);

    // Simulación de respuesta de API
    setTimeout(() => {
      this.loading = false;
      this.mensajeExito = 'Hemos enviado un enlace de recuperación a tu correo electrónico.';
    }, 1500);
  }
}
