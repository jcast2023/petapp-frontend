import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const pesosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listado/listado-pesos.component')
      .then(m => m.ListadoPesosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear-peso.component')
      .then(m => m.CrearPesoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar-peso.component')
      .then(m => m.EditarPesoComponent),
    canActivate: [authGuard]
  }
];
