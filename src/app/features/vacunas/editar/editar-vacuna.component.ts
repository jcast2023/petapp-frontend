import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { VacunaService } from '../../../core/services/vacuna.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-editar-vacuna',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-vacuna.component.html',
  styleUrl: './editar-vacuna.component.scss'
})
export class EditarVacunaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly vacunaService = inject(VacunaService);
  private readonly mascotaService = inject(MascotaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  mascotas = signal<Mascota[]>([]);
  filtroBusqueda = signal('');
  cargando = signal(false);
  cargandoMascotas = signal(false);
  error = signal('');
  vacunaId = 0;

  mascotasFiltradas = computed(() => {
    const filtro = this.filtroBusqueda().toLowerCase().trim();
    if (!filtro) return this.mascotas();
    return this.mascotas().filter(m =>
      m.nombre.toLowerCase().includes(filtro) ||
      m.especie.toLowerCase().includes(filtro) ||
      (m.raza && m.raza.toLowerCase().includes(filtro))
    );
  });

  formulario = this.fb.group({
    nombreVacuna: ['', [Validators.required, Validators.minLength(2)]],
    fechaAplicacion: ['', [Validators.required]],
    fechaProximaDosis: ['', [Validators.required]],
    veterinario: [''],
    notas: [''],
    mascotaId: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.vacunaId = Number(this.route.snapshot.params['id']);
    this.cargarMascotas();
    this.cargarVacuna();
  }

  cargarMascotas(): void {
    this.cargandoMascotas.set(true);
    this.mascotaService.listar()
      .pipe(finalize(() => this.cargandoMascotas.set(false)))
      .subscribe({
        next: (mascotas) => {
          this.mascotas.set(mascotas);
        },
        error: () => {
          this.error.set('Error al cargar las mascotas');
        }
      });
  }

  cargarVacuna(): void {
    this.cargando.set(true);
    this.vacunaService.obtenerPorId(this.vacunaId)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (vacuna) => {
          this.formulario.patchValue({
            nombreVacuna: vacuna.nombreVacuna,
            fechaAplicacion: vacuna.fechaAplicacion,
            fechaProximaDosis: vacuna.fechaProximaDosis,
            veterinario: vacuna.veterinario,
            notas: vacuna.notas,
            mascotaId: String(vacuna.mascota.id)
          });
        },
        error: () => {
          this.error.set('Error al cargar el registro de vacuna');
        }
      });
  }

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroBusqueda.set(input.value);
  }

  seleccionarMascota(id: number): void {
    this.formulario.patchValue({ mascotaId: String(id) });
    this.filtroBusqueda.set('');
  }

  limpiarSeleccion(): void {
    this.formulario.patchValue({ mascotaId: '' });
    this.filtroBusqueda.set('');
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    const datos = this.formulario.value;

    this.vacunaService.actualizar(this.vacunaId, {
      nombreVacuna: datos.nombreVacuna!,
      fechaAplicacion: datos.fechaAplicacion!,
      fechaProximaDosis: datos.fechaProximaDosis!,
      veterinario: datos.veterinario || '',
      notas: datos.notas || '',
      mascotaId: Number(datos.mascotaId!)
    })
    .pipe(finalize(() => this.cargando.set(false)))
    .subscribe({
      next: () => {
        this.router.navigate(['/vacunas']);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error.error?.mensaje || 'Error al actualizar el registro');
      }
    });
  }
}
