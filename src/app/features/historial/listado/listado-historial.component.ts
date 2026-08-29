import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { HistorialMedicoService } from '../../../core/services/historial-medico.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { HistorialMedico } from '../../../core/models/historial-medico.models';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-listado-historial',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-historial.component.html',
  styleUrl: './listado-historial.component.scss'
})
export class ListadoHistorialComponent implements OnInit {
  private readonly historialService = inject(HistorialMedicoService);
  private readonly mascotaService = inject(MascotaService);

  readonly historiales = signal<HistorialMedico[]>([]);
  readonly mascotas = signal<Mascota[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarHistorial();
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

  cargarHistorial(): void {
    this.cargando.set(true);
    this.error.set('');

    this.historialService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
      }))
      .subscribe({
        next: (historiales) => {
          const ordenados = [...historiales].sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          this.historiales.set(ordenados);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error cargando historial:', error);
          this.error.set('Error al cargar el historial médico');
        }
      });
  }

  obtenerNombreMascota(mascotaId: number): string {
    const mascota = this.mascotas().find(m => m.id === mascotaId);
    return mascota ? mascota.nombre : 'Sin mascota';
  }

  eliminarHistorial(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro del historial médico?')) {
      return;
    }

    this.historialService.eliminar(id)
      .subscribe({
        next: () => {
          this.historiales.update(lista => lista.filter(h => h.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error eliminando historial:', error);
          this.error.set('Error al eliminar el registro');
        }
      });
  }

  truncarTexto(texto: string, maxLength: number = 50): string {
    if (!texto) return '-';
    return texto.length > maxLength ? texto.substring(0, maxLength) + '...' : texto;
  }
}
