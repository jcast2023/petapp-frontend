import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { DesparasitacionService } from '../../../core/services/desparasitacion.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Desparasitacion } from '../../../core/models/desparasitacion.models';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-listado-desparasitaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-desparasitaciones.component.html',
  styleUrl: './listado-desparasitaciones.component.scss'
})
export class ListadoDesparasitacionesComponent implements OnInit {
  private readonly desparasitacionService = inject(DesparasitacionService);
  private readonly mascotaService = inject(MascotaService);

  readonly desparasitaciones = signal<Desparasitacion[]>([]);
  readonly mascotas = signal<Mascota[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarDesparasitaciones();
  }

  cargarMascotas(): void {
    this.mascotaService.listar().subscribe({
      next: (mascotas) => {
        this.mascotas.set(mascotas);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error cargando mascotas:', error);
      }
    });
  }

  cargarDesparasitaciones(): void {
    this.cargando.set(true);
    this.error.set('');

    this.desparasitacionService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
      }))
      .subscribe({
        next: (desparasitaciones) => {
          this.desparasitaciones.set(desparasitaciones);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error cargando desparasitaciones:', error);
          this.error.set('Error al cargar las desparasitaciones');
        }
      });
  }

  obtenerNombreMascota(mascotaId: number): string {
    const mascota = this.mascotas().find(m => m.id === mascotaId);
    return mascota ? mascota.nombre : 'Sin mascota';
  }

  eliminarDesparasitacion(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro de desparasitación?')) {
      return;
    }

    this.desparasitacionService.eliminar(id)
      .subscribe({
        next: () => {
          this.desparasitaciones.update(lista => lista.filter(d => d.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error eliminando desparasitación:', error);
          this.error.set('Error al eliminar el registro');
        }
      });
  }

  getTipoClass(tipo: string): string {
    return tipo === 'Interna' ? 'tipo-interna' : 'tipo-externa';
  }
}
