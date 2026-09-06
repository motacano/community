import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent)
  },
  {
    path: 'progravity',
    loadComponent: () =>
      import('./pages/progravity/progravity-page').then((m) => m.ProgravityPageComponent)
  }
];
