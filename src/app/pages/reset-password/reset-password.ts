import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

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
  private authService = inject(AuthService);

  token: string | null = null;
  loading = false;
  mensajeExito = '';
  mensajeError = '';

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.mensajeError = 'El enlace de recuperación es inválido o ha expirado.';
    }
  }

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

    this.authService.restablecerPassword(this.token, newPassword)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (res: string) => {
          this.mensajeExito = res || '¡Tu contraseña ha sido actualizada con éxito!';
          setTimeout(() => this.router.navigate(['/login']), 2500);
        },
        error: (err) => {
          this.mensajeError = err.error || 'El token es inválido o ha expirado. Solicita un nuevo enlace.';
        }
      });
  }
}
