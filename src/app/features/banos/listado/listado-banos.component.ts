import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { BanoService } from '../../../core/services/bano.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Bano } from '../../../core/models/bano.models';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-listado-banos',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-banos.component.html',
  styleUrl: './listado-banos.component.scss'
})
export class ListadoBanosComponent implements OnInit {
  private readonly banoService = inject(BanoService);
  private readonly mascotaService = inject(MascotaService);

  readonly banos = signal<Bano[]>([]);
  readonly mascotas = signal<Mascota[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarBanos();
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

  cargarBanos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.banoService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
      }))
      .subscribe({
        next: (banos) => {
          this.banos.set(banos);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set('Error al cargar los baños: ' + (error.error?.mensaje || error.message));
        }
      });
  }

  obtenerNombreMascota(mascotaId: number): string {
    const mascota = this.mascotas().find(m => m.id === mascotaId);
    return mascota ? mascota.nombre : 'Mascota ID: ' + mascotaId;
  }

  eliminarBano(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro de baño?')) {
      return;
    }

    this.banoService.eliminar(id)
      .subscribe({
        next: () => {
          this.banos.update(lista => lista.filter(b => b.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          this.error.set('Error al eliminar el registro');
        }
      });
  }
}
