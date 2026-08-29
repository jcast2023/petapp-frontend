import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { PesoService } from '../../../core/services/peso.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Peso } from '../../../core/models/peso.models';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-listado-pesos',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-pesos.component.html',
  styleUrl: './listado-pesos.component.scss'
})
export class ListadoPesosComponent implements OnInit {
  private readonly pesoService = inject(PesoService);
  private readonly mascotaService = inject(MascotaService);

  readonly pesos = signal<Peso[]>([]);
  readonly mascotas = signal<Mascota[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarPesos();
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

  cargarPesos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.pesoService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
      }))
      .subscribe({
        next: (pesos) => {
          const ordenados = [...pesos].sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          this.pesos.set(ordenados);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error cargando pesos:', error);
          this.error.set('Error al cargar los registros de peso');
        }
      });
  }

  obtenerNombreMascota(mascotaId: number): string {
    const mascota = this.mascotas().find(m => m.id === mascotaId);
    return mascota ? mascota.nombre : 'Sin mascota';
  }

  eliminarPeso(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro de peso?')) {
      return;
    }

    this.pesoService.eliminar(id)
      .subscribe({
        next: () => {
          this.pesos.update(lista => lista.filter(p => p.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error eliminando registro de peso:', error);
          this.error.set('Error al eliminar el registro');
        }
      });
  }
}
