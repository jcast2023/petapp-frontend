import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { DesparasitacionService } from '../../../core/services/desparasitacion.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-crear-desparasitacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear-desparasitacion.component.html',
  styleUrl: './crear-desparasitacion.component.scss'
})
export class CrearDesparasitacionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly desparasitacionService = inject(DesparasitacionService);
  private readonly mascotaService = inject(MascotaService);
  private readonly router = inject(Router);

  mascotas = signal<Mascota[]>([]);
  filtroBusqueda = signal('');
  cargando = signal(false);
  cargandoMascotas = signal(false);
  error = signal('');

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
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.cargandoMascotas.set(true);
    this.error.set('');

    this.mascotaService.listar()
      .pipe(finalize(() => this.cargandoMascotas.set(false)))
      .subscribe({
        next: (mascotas) => {
          console.log('✅ Mascotas cargadas:', mascotas.length);
          this.mascotas.set(mascotas);
        },
        error: () => {
          this.error.set('Error al cargar las mascotas. Verifica que tengas mascotas registradas.');
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

    console.log('📤 Creando desparasitación:', datos);

    this.desparasitacionService.crear({
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
      error: (err: { mensaje: string; status: number }) => {
        console.error('❌ Error creando desparasitación:', err);
        this.error.set(err.mensaje || 'Error al crear el registro de desparasitación');
      }
    });
  }
}
