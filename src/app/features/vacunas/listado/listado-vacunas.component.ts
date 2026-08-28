import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { VacunaService } from '../../../core/services/vacuna.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Vacuna } from '../../../core/models/vacuna.models';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-listado-vacunas',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-vacunas.component.html',
  styleUrl: './listado-vacunas.component.scss'
})
export class ListadoVacunasComponent implements OnInit {
  private readonly vacunaService = inject(VacunaService);
  private readonly mascotaService = inject(MascotaService);

  readonly vacunas = signal<Vacuna[]>([]);
  readonly mascotas = signal<Mascota[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarVacunas();
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

  cargarVacunas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.vacunaService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
      }))
      .subscribe({
        next: (vacunas) => {
          this.vacunas.set(vacunas);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set('Error al cargar los registros de vacunas: ' + (error.error?.mensaje || error.message));
        }
      });
  }

  obtenerNombreMascota(mascotaId: number): string {
    const mascota = this.mascotas().find(m => m.id === mascotaId);
    return mascota ? mascota.nombre : 'Sin mascota';
  }

  eliminarVacuna(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro de vacuna?')) {
      return;
    }

    this.vacunaService.eliminar(id)
      .subscribe({
        next: () => {
          this.vacunas.update(lista => lista.filter(v => v.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          this.error.set('Error al eliminar el registro');
        }
      });
  }
}
