import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const vacunasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listado/listado-vacunas.component')
      .then(m => m.ListadoVacunasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear-vacuna.component')
      .then(m => m.CrearVacunaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar-vacuna.component')
      .then(m => m.EditarVacunaComponent),
    canActivate: [authGuard]
  }
];
