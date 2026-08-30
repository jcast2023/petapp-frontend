import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { VideoService } from '../../../core/services/video.service';
import { Video } from '../../../core/models/video.models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-listado-videos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado-videos.component.html',
  styleUrl: './listado-videos.component.scss'
})
export class ListadoVideosComponent implements OnInit {
  private readonly videoService = inject(VideoService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly videos = signal<Video[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  niveles = {
    'Básico': 'badge-basico',
    'Intermedio': 'badge-intermedio',
    'Avanzado': 'badge-avanzado'
  };

  get esAdmin(): boolean {
    return this.authService.getRole() === 'ROLE_ADMIN';
  }

  ngOnInit(): void {
    console.log('🔄 Inicializando ListadoVideosComponent');
    this.cargarVideos();
  }

  cargarVideos(): void {
    this.cargando.set(true);
    this.error.set('');
    console.log('📤 Cargando videos de obediencia...');

    this.videoService.listar()
      .pipe(finalize(() => {
        this.cargando.set(false);
        console.log('✅ Finalizada carga de videos');
      }))
      .subscribe({
        next: (videos) => {
          console.log('📋 Videos recibidos:', videos.length);
          this.videos.set(videos);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error cargando videos:', error);
          this.error.set('Error al cargar los videos de obediencia');
        }
      });
  }

  verVideo(id: number): void {
    this.router.navigate(['/videos/reproducir', id]);
  }

  eliminarVideo(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este video?')) {
      return;
    }

    console.log('🗑️ Eliminando video ID:', id);
    this.videoService.eliminar(id)
      .subscribe({
        next: () => {
          console.log('✅ Video eliminado exitosamente');
          this.videos.update(lista => lista.filter(v => v.id !== id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error eliminando video:', error);
          this.error.set('Error al eliminar el video');
        }
      });
  }

  getNivelClass(nivel: string): string {
    return this.niveles[nivel as keyof typeof this.niveles] || '';
  }

  formatearDuracion(segundos: number): string {
    if (!segundos) return '-';
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  }

  obtenerMiniatura(video: Video): string {
  // 1. Si ya tiene miniatura explícita, la usa
  if (video.miniaturaUrl) {
    return video.miniaturaUrl;
  }

  // 2. Extraer miniatura desde urlVideo
  if (video.urlVideo) {
    const url = video.urlVideo;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
  }

  // 3. Fallback en caso no sea un enlace de YouTube
  return 'https://via.placeholder.com/600x400?text=PetApp+Video';
}
}
