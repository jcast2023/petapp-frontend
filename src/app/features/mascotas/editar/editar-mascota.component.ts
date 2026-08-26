import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { MascotaService } from '../../../core/services/mascota.service';

@Component({
  selector: 'app-editar-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-mascota.component.html',
  styleUrl: './editar-mascota.component.scss'
})
export class EditarMascotaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.cargarMascota(Number(id));
    }
  }

  cargarMascota(id: number): void {
    this.cargando = true;
    this.mascotaService.obtenerPorId(id)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (mascota) => {
          this.formulario.patchValue({
            nombre: mascota.nombre,
            especie: mascota.especie,
            raza: mascota.raza,
            fechaNacimiento: mascota.fechaNacimiento,
            sexo: mascota.sexo,
            fotoUrl: mascota.fotoUrl
          });
        },
        error: () => {
          this.error = 'Error al cargar la mascota';
        }
      });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const id = Number(this.route.snapshot.params['id']);
    this.cargando = true;
    this.error = '';

    this.mascotaService.actualizar(id, this.formulario.value as any)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/mascotas']);
        },
        error: () => {
          this.error = 'Error al actualizar la mascota';
        }
      });
  }
}
