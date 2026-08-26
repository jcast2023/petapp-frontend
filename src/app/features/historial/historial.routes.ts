import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const historialRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listado/listado-historial.component')
      .then(m => m.ListadoHistorialComponent),
    canActivate: [authGuard]
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear-historial.component')
      .then(m => m.CrearHistorialComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar-historial.component')
      .then(m => m.EditarHistorialComponent),
    canActivate: [authGuard]
  }
];
