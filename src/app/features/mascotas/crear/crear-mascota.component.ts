import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { MascotaService } from '../../../core/services/mascota.service';

@Component({
  selector: 'app-crear-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear-mascota.component.html',
  styleUrl: './crear-mascota.component.scss'
})
export class CrearMascotaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly router = inject(Router);

  cargando = false;
  error = '';

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    especie: ['', [Validators.required, Validators.minLength(2)]],
    raza: [''],
    fechaNacimiento: ['', [Validators.required]],
    sexo: [''],
    fotoUrl: ['']
  });

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    this.mascotaService.crear(this.formulario.value as any)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/mascotas']);
        },
        error: () => {
          this.error = 'Error al crear la mascota';
        }
      });
  }
}
