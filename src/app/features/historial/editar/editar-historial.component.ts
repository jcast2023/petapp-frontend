import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { HistorialMedicoService } from '../../../core/services/historial-medico.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-editar-historial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-historial.component.html',
  styleUrl: './editar-historial.component.scss'
})
export class EditarHistorialComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly historialService = inject(HistorialMedicoService);
  private readonly mascotaService = inject(MascotaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  mascotas = signal<Mascota[]>([]);
  filtroBusqueda = signal('');
  cargando = signal(false);
  cargandoMascotas = signal(false);
  error = signal('');
  historialId = 0;

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
    fecha: ['', [Validators.required]],
    motivoConsulta: ['', [Validators.required, Validators.minLength(3)]],
    diagnostico: ['', [Validators.required, Validators.minLength(3)]],
    tratamiento: [''],
    veterinario: [''],
    clinica: [''],
    mascotaId: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.historialId = Number(this.route.snapshot.params['id']);
    this.cargarMascotas();
    this.cargarHistorial();
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

    cargarHistorial(): void {
    this.cargando.set(true);
    this.historialService.obtenerPorId(this.historialId)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (historial) => {
          this.formulario.patchValue({
            fecha: historial.fecha,
            motivoConsulta: historial.motivoConsulta,
            diagnostico: historial.diagnostico,
            tratamiento: historial.tratamiento,
            veterinario: historial.veterinario,
            clinica: historial.clinica,
            mascotaId: String(historial.mascotaId)
          });
        },
        error: () => {
          this.error.set('Error al cargar el registro de historial médico');
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

    this.historialService.actualizar(this.historialId, {
      fecha: datos.fecha!,
      motivoConsulta: datos.motivoConsulta!,
      diagnostico: datos.diagnostico!,
      tratamiento: datos.tratamiento || '',
      veterinario: datos.veterinario || '',
      clinica: datos.clinica || '',
      mascotaId: Number(datos.mascotaId!)
    })
    .pipe(finalize(() => this.cargando.set(false)))
    .subscribe({
      next: () => {
        this.router.navigate(['/historial']);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error.error?.mensaje || 'Error al actualizar el registro');
      }
    });
  }
}
