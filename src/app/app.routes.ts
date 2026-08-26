import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
      .then(m => m.Login)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/registro/registro')
      .then(m => m.Registro)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard')
      .then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'mascotas',
    loadChildren: () => import('./features/mascotas/mascotas.routes')
      .then(m => m.mascotasRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'banos',
    loadChildren: () => import('./features/banos/banos.routes')
      .then(m => m.banosRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'vacunas',
    loadChildren: () => import('./features/vacunas/vacunas.routes')
      .then(m => m.vacunasRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'desparasitaciones',
    loadChildren: () => import('./features/desparasitaciones/desparasitaciones.routes')
      .then(m => m.desparasitacionesRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'pesos',
    loadChildren: () => import('./features/pesos/pesos.routes')
      .then(m => m.pesosRoutes),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
  path: 'historial',
  loadChildren: () => import('./features/historial/historial.routes')
    .then(m => m.historialRoutes),
  canActivate: [authGuard]
},
{
  path: 'videos',
  loadChildren: () => import('./features/videos/videos.routes')
    .then(m => m.videosRoutes),
  canActivate: [authGuard]
},
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
