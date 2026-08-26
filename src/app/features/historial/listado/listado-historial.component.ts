import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { HistorialMedicoService } from '../../../core/services/historial-medico.service';
import { HistorialMedico } from '../../../core/models/historial-medico.models';

@Component({
  selector: 'app-listado-historial',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-historial.component.html',
  styleUrl: './listado-historial.component.scss'
})
export class ListadoHistorialComponent implements OnInit {
  private readonly historialService = inject(HistorialMedicoService);

  readonly historiales = signal<HistorialMedico[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    console.log('🔄 Inicializando ListadoHistorialComponent');
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando.set(true);
    this.error.set('');
    console.log('📤 Cargando historial médico...');

    this.historialService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
        console.log('✅ Finalizada carga de historial médico');
      }))
      .subscribe({
        next: (historiales) => {
          console.log('📋 Historiales recibidos:', historiales.length);
          // Ordenar por fecha descendente (más reciente primero)
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

  eliminarHistorial(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro del historial médico?')) {
      return;
    }

    console.log('🗑️ Eliminando historial ID:', id);
    this.historialService.eliminar(id)
      .subscribe({
        next: () => {
          console.log('✅ Historial eliminado exitosamente');
          this.historiales.update(lista => lista.filter(h => h.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error eliminando historial:', error);
          this.error.set('Error al eliminar el registro');
        }
      });
  }

  // Función para truncar texto largo
  truncarTexto(texto: string, maxLength: number = 50): string {
    if (!texto) return '-';
    return texto.length > maxLength ? texto.substring(0, maxLength) + '...' : texto;
  }
}
