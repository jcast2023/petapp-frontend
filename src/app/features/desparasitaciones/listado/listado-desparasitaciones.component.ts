import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { DesparasitacionService } from '../../../core/services/desparasitacion.service';
import { Desparasitacion } from '../../../core/models/desparasitacion.models';

@Component({
  selector: 'app-listado-desparasitaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-desparasitaciones.component.html',
  styleUrl: './listado-desparasitaciones.component.scss'
})
export class ListadoDesparasitacionesComponent implements OnInit {
  private readonly desparasitacionService = inject(DesparasitacionService);

  readonly desparasitaciones = signal<Desparasitacion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    console.log('🔄 Inicializando ListadoDesparasitacionesComponent');
    this.cargarDesparasitaciones();
  }

  cargarDesparasitaciones(): void {
    this.cargando.set(true);
    this.error.set('');
    console.log('📤 Cargando desparasitaciones...');

    this.desparasitacionService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
        console.log('✅ Finalizada carga de desparasitaciones');
      }))
      .subscribe({
        next: (desparasitaciones) => {
          console.log('📋 Desparasitaciones recibidas:', desparasitaciones.length);
          this.desparasitaciones.set(desparasitaciones);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error cargando desparasitaciones:', error);
          this.error.set('Error al cargar las desparasitaciones');
        }
      });
  }

  eliminarDesparasitacion(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro de desparasitación?')) {
      return;
    }

    console.log('🗑️ Eliminando desparasitación ID:', id);
    this.desparasitacionService.eliminar(id)
      .subscribe({
        next: () => {
          console.log('✅ Desparasitación eliminada exitosamente');
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
