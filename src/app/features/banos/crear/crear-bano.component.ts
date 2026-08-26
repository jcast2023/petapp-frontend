import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { BanoService } from '../../../core/services/bano.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-crear-bano',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear-bano.component.html',
  styleUrl: './crear-bano.component.scss'
})
export class CrearBanoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly banoService = inject(BanoService);
  private readonly mascotaService = inject(MascotaService);
  private readonly router = inject(Router);

  mascotas = signal<Mascota[]>([]);
  filtroBusqueda = signal('');
  cargando = signal(false);
  cargandoMascotas = signal(false);
  error = signal('');

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
    notas: [''],
    mascotaId: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.cargandoMascotas.set(true);
    this.error.set('');

    console.log('📤 Cargando mascotas para el select...');

    this.mascotaService.listar()
      .pipe(finalize(() => this.cargandoMascotas.set(false)))
      .subscribe({
        next: (mascotas) => {
          console.log('✅ Mascotas cargadas:', mascotas.length);
          this.mascotas.set(mascotas);
        },
        error: (err) => {
          console.error('❌ Error cargando mascotas:', err);
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

    console.log('📤 Creando baño:', datos);

    this.banoService.crear({
      fecha: datos.fecha!,
      notas: datos.notas || '',
      mascotaId: Number(datos.mascotaId!)
    })
    .pipe(finalize(() => this.cargando.set(false)))
    .subscribe({
      next: (response) => {
        console.log('✅ Baño creado:', response);
        this.router.navigate(['/banos']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error creando baño:', error);
        this.error.set(error.error?.mensaje || 'Error al crear el registro de baño');
      }
    });
  }
}
