import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const mascotasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listado/listado-mascotas.component')
      .then(m => m.ListadoMascotasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear-mascota.component')
      .then(m => m.CrearMascotaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar-mascota.component')
      .then(m => m.EditarMascotaComponent),
    canActivate: [authGuard]
  }
];
