import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const banosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listado/listado-banos.component')
      .then(m => m.ListadoBanosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear-bano.component')
      .then(m => m.CrearBanoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar-bano.component')
      .then(m => m.EditarBanoComponent),
    canActivate: [authGuard]
  }
];
