import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const videosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listado/listado-videos.component')
      .then(m => m.ListadoVideosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reproducir/:id',
    loadComponent: () => import('./reproductor/reproductor-video.component')
      .then(m => m.ReproductorVideoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear-video.component')
      .then(m => m.CrearVideoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar-video.component')
      .then(m => m.EditarVideoComponent),
    canActivate: [authGuard]
  }
];
