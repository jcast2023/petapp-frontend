import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { VideoService } from '../../../core/services/video.service';

@Component({
  selector: 'app-editar-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-video.component.html',
  styleUrl: './editar-video.component.scss'
})
export class EditarVideoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly videoService = inject(VideoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  cargando = signal(false);
  error = signal('');
  videoId = 0;

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

  ngOnInit(): void {
    this.videoId = Number(this.route.snapshot.params['id']);
    this.cargarVideo();
  }

  cargarVideo(): void {
    this.cargando.set(true);
    this.videoService.obtenerPorId(this.videoId)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (video) => {
          this.formulario.patchValue({
            titulo: video.titulo,
            descripcion: video.descripcion,
            urlVideo: video.urlVideo,
            comando: video.comando,
            nivel: video.nivel,
            duracionSegundos: String(video.duracionSegundos),
            miniaturaUrl: video.miniaturaUrl
          });
        },
        error: () => {
          this.error.set('Error al cargar el video');
        }
      });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    const datos = this.formulario.value;

    this.videoService.actualizar(this.videoId, {
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
        this.error.set(error.error?.mensaje || 'Error al actualizar el video');
      }
    });
  }
}
