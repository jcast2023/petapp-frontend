import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const desparasitacionesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listado/listado-desparasitaciones.component')
      .then(m => m.ListadoDesparasitacionesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear-desparasitacion.component')
      .then(m => m.CrearDesparasitacionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar-desparasitacion.component')
      .then(m => m.EditarDesparasitacionComponent),
    canActivate: [authGuard]
  }
];
