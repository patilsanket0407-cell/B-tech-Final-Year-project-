import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard – OT Readiness Prediction System',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'control',
    title: 'Control Panel – OT Readiness Prediction System',
    loadComponent: () => import('./pages/control-panel/control-panel').then((m) => m.ControlPanel),
  },
  {
    path: 'about',
    title: 'About & Help – OT Readiness Prediction System',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  { path: '**', redirectTo: 'dashboard' },
];
