import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token: string | null = null;
  loading = false;
  mensajeExito = '';
  mensajeError = '';

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    // Lee el token desde los parámetros de la URL (ej. /reset-password?token=XYZ)
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.mensajeError = 'El enlace de recuperación es inválido o ha expirado.';
    }
  }

  // Validador personalizado para comparar contraseñas
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const newPassword = this.form.value.password;

    // TODO: Conectar con tu servicio AuthService pasando el token y la nueva contraseña
    console.log('Restableciendo contraseña con token:', this.token, newPassword);

    setTimeout(() => {
      this.loading = false;
      this.mensajeExito = '¡Tu contraseña ha sido actualizada con éxito!';
      setTimeout(() => this.router.navigate(['/login']), 2500);
    }, 1500);
  }
}
