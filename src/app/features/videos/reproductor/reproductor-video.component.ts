import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { VideoService } from '../../../core/services/video.service';
import { Video } from '../../../core/models/video.models';

@Component({
  selector: 'app-reproductor-video',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reproductor-video.component.html',
  styleUrl: './reproductor-video.component.scss'
})
export class ReproductorVideoComponent implements OnInit {
  private readonly videoService = inject(VideoService);
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  video = signal<Video | null>(null);
  cargando = signal(true);
  error = signal('');
  urlSegura = signal<SafeResourceUrl | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.cargarVideo(id);
  }

  cargarVideo(id: number): void {
    this.cargando.set(true);
    this.videoService.obtenerPorId(id)
      .subscribe({
        next: (video) => {
          this.video.set(video);
          this.urlSegura.set(this.obtenerUrlSegura(video.urlVideo));
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('Error al cargar el video');
          this.cargando.set(false);
        }
      });
  }

  obtenerUrlSegura(url: string): SafeResourceUrl {
    let embedUrl = url;

    // YouTube - https://www.youtube.com/watch?v=XXXXX
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    // YouTube - https://youtu.be/XXXXX
    else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    // Vimeo
    else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('/')[0];
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  volver(): void {
    window.history.back();
  }

  getNivelClass(nivel: string): string {
    const clases = {
      'Básico': 'badge-basico',
      'Intermedio': 'badge-intermedio',
      'Avanzado': 'badge-avanzado'
    };
    return clases[nivel as keyof typeof clases] || '';
  }

  formatearDuracion(segundos: number): string {
    if (!segundos) return '-';
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  }
}
