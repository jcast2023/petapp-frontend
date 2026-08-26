import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { VideoService } from '../../../core/services/video.service';

@Component({
  selector: 'app-crear-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear-video.component.html',
  styleUrl: './crear-video.component.scss'
})
export class CrearVideoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly videoService = inject(VideoService);
  private readonly router = inject(Router);

  cargando = signal(false);
  error = signal('');

  niveles = ['Básico', 'Intermedio', 'Avanzado'];

  formulario = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    urlVideo: ['', [Validators.required, Validators.pattern('https?://.+')]],
    comando: ['', [Validators.required]],
    nivel: ['', [Validators.required]],
    duracionSegundos: ['', [Validators.required, Validators.min(1)]],
    miniaturaUrl: ['', [Validators.pattern('https?://.+')]]
  });

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    const datos = this.formulario.value;

    console.log('📤 Creando video:', datos);

    this.videoService.crear({
      titulo: datos.titulo!,
      descripcion: datos.descripcion || '',
      urlVideo: datos.urlVideo!,
      comando: datos.comando!,
      nivel: datos.nivel!,
      duracionSegundos: Number(datos.duracionSegundos!),
      miniaturaUrl: datos.miniaturaUrl || ''
    })
    .pipe(finalize(() => this.cargando.set(false)))
    .subscribe({
      next: () => {
        this.router.navigate(['/videos']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error creando video:', error);
        this.error.set(error.error?.mensaje || 'Error al crear el video');
      }
    });
  }
}
