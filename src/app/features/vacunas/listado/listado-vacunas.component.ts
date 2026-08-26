import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { VacunaService } from '../../../core/services/vacuna.service';
import { Vacuna } from '../../../core/models/vacuna.models';

@Component({
  selector: 'app-listado-vacunas',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-vacunas.component.html',
  styleUrl: './listado-vacunas.component.scss'
})
export class ListadoVacunasComponent implements OnInit {
  private readonly vacunaService = inject(VacunaService);

  readonly vacunas = signal<Vacuna[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    console.log('🔄 Inicializando ListadoVacunasComponent');
    this.cargarVacunas();
  }

  cargarVacunas(): void {
  this.cargando.set(true);
  this.error.set('');
  console.log('📤 Cargando vacunas...');

  this.vacunaService.listar()
    .pipe(finalize(() => {
      this.cargando.set(false);
      console.log('✅ Finalizada carga de vacunas');
    }))
    .subscribe({
      next: (vacunas) => {
        console.log('📋 Vacunas recibidas:', vacunas);
        console.log('📊 Cantidad:', vacunas.length);
        if (vacunas.length > 0) {
          console.log('🔍 Primera vacuna:', JSON.stringify(vacunas[0], null, 2));
        }
        this.vacunas.set(vacunas);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error cargando vacunas:', error);
        this.error.set('Error al cargar las vacunas');
      }
    });
}

  eliminarVacuna(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro de vacuna?')) {
      return;
    }

    console.log('🗑️ Eliminando vacuna ID:', id);
    this.vacunaService.eliminar(id)
      .subscribe({
        next: () => {
          console.log('✅ Vacuna eliminada exitosamente');
          this.vacunas.update(lista => lista.filter(v => v.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error eliminando vacuna:', error);
          this.error.set('Error al eliminar el registro');
        }
      });
  }
}
