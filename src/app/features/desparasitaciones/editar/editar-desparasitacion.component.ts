import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { DesparasitacionService } from '../../../core/services/desparasitacion.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-editar-desparasitacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-desparasitacion.component.html',
  styleUrl: './editar-desparasitacion.component.scss'
})
export class EditarDesparasitacionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly desparasitacionService = inject(DesparasitacionService);
  private readonly mascotaService = inject(MascotaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  mascotas = signal<Mascota[]>([]);
  filtroBusqueda = signal('');
  cargando = signal(false);
  cargandoMascotas = signal(false);
  error = signal('');
  desparasitacionId = 0;

  tiposDesparasitacion = ['Interna', 'Externa'];

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
    tipo: ['', [Validators.required]],
    producto: ['', [Validators.required, Validators.minLength(2)]],
    fechaAplicacion: ['', [Validators.required]],
    fechaProximaDosis: ['', [Validators.required]],
    notas: [''],
    mascotaId: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.desparasitacionId = Number(this.route.snapshot.params['id']);
    this.cargarMascotas();
    this.cargarDesparasitacion();
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

    cargarDesparasitacion(): void {
    this.cargando.set(true);
    this.desparasitacionService.obtenerPorId(this.desparasitacionId)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (desparasitacion) => {
          this.formulario.patchValue({
            tipo: desparasitacion.tipo,
            producto: desparasitacion.producto,
            fechaAplicacion: desparasitacion.fechaAplicacion,
            fechaProximaDosis: desparasitacion.fechaProximaDosis,
            notas: desparasitacion.notas,
            mascotaId: String(desparasitacion.mascotaId)
          });
        },
        error: () => {
          this.error.set('Error al cargar el registro de desparasitación');
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

    this.desparasitacionService.actualizar(this.desparasitacionId, {
      tipo: datos.tipo!,
      producto: datos.producto!,
      fechaAplicacion: datos.fechaAplicacion!,
      fechaProximaDosis: datos.fechaProximaDosis!,
      notas: datos.notas || '',
      mascotaId: Number(datos.mascotaId!)
    })
    .pipe(finalize(() => this.cargando.set(false)))
    .subscribe({
      next: () => {
        this.router.navigate(['/desparasitaciones']);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error.error?.mensaje || 'Error al actualizar el registro');
      }
    });
  }
}
