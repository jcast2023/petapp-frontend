import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { PesoService } from '../../../core/services/peso.service';
import { Peso } from '../../../core/models/peso.models';

@Component({
  selector: 'app-listado-pesos',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-pesos.component.html',
  styleUrl: './listado-pesos.component.scss'
})
export class ListadoPesosComponent implements OnInit {
  private readonly pesoService = inject(PesoService);

  readonly pesos = signal<Peso[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    console.log('🔄 Inicializando ListadoPesosComponent');
    this.cargarPesos();
  }

  cargarPesos(): void {
    this.cargando.set(true);
    this.error.set('');
    console.log('📤 Cargando registros de peso...');

    this.pesoService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
        console.log('✅ Finalizada carga de registros de peso');
      }))
      .subscribe({
        next: (pesos) => {
          console.log('📋 Pesos recibidos:', pesos.length);
          // Ordenar por fecha descendente (más reciente primero)
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

  eliminarPeso(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro de peso?')) {
      return;
    }

    console.log('🗑️ Eliminando registro de peso ID:', id);
    this.pesoService.eliminar(id)
      .subscribe({
        next: () => {
          console.log('✅ Registro de peso eliminado exitosamente');
          this.pesos.update(lista => lista.filter(p => p.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error eliminando registro de peso:', error);
          this.error.set('Error al eliminar el registro');
        }
      });
  }
}
