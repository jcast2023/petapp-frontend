import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-listado-mascotas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado-mascotas.component.html',
  styleUrl: './listado-mascotas.component.scss'
})
export class ListadoMascotasComponent implements OnInit {
  private readonly mascotaService = inject(MascotaService);

  readonly mascotas = signal<Mascota[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.mascotaService.listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (mascotas) => {
          this.mascotas.set(mascotas);
        },
        error: () => {
          this.error.set('Error al cargar las mascotas');
        }
      });
  }

  eliminarMascota(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) {
      return;
    }

    this.mascotaService.eliminar(id)
      .subscribe({
        next: () => {
          this.mascotas.update(lista => lista.filter(m => m.id !== id));
        },
        error: () => {
          this.error.set('Error al eliminar la mascota');
        }
      });
  }
}
