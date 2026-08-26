import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { BanoService } from '../../../core/services/bano.service';
import { Bano } from '../../../core/models/bano.models';

@Component({
  selector: 'app-listado-banos',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listado-banos.component.html',
  styleUrl: './listado-banos.component.scss'
})
export class ListadoBanosComponent implements OnInit {
  private readonly banoService = inject(BanoService);

  readonly banos = signal<Bano[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    console.log('🔄 Inicializando ListadoBanosComponent');
    this.cargarBanos();
  }

  cargarBanos(): void {
    this.cargando.set(true);
    this.error.set('');
    console.log('📤 Cargando baños...');

    this.banoService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
        console.log('✅ Finalizada carga de baños');
      }))
      .subscribe({
        next: (banos) => {
          console.log('📋 Baños recibidos del backend:', banos);
          console.log('📊 Cantidad de baños:', banos.length);
          if (banos.length > 0) {
            console.log('🔍 Primer baño:', banos[0]);
            console.log('🔍 Mascota del primer baño:', banos[0].mascota);
            console.log('🔍 Nombre de la mascota:', banos[0].mascota?.nombre);
          }
          this.banos.set(banos);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error cargando baños:', error);
          console.error('❌ Status:', error.status);
          console.error('❌ Body:', error.error);
          this.error.set('Error al cargar los baños: ' + (error.error?.mensaje || error.message));
        }
      });
  }

  eliminarBano(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro de baño?')) {
      return;
    }

    console.log('🗑️ Eliminando baño ID:', id);
    this.banoService.eliminar(id)
      .subscribe({
        next: () => {
          console.log('✅ Baño eliminado exitosamente');
          this.banos.update(lista => lista.filter(b => b.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error eliminando baño:', error);
          this.error.set('Error al eliminar el registro');
        }
      });
  }
}
