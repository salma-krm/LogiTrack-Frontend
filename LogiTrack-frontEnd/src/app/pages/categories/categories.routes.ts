import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../features/admin/admin-layout/admin-layout.component';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./categories').then(m => m.CategoriesComponent)
      },
      {
        path: 'list',
        loadComponent: () => import('./categories').then(m => m.CategoriesComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./categories').then(m => m.CategoriesComponent),
        data: { action: 'create' }
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./categories').then(m => m.CategoriesComponent),
        data: { action: 'edit' }
      },
      {
        path: 'view/:id',
        loadComponent: () => import('./categories').then(m => m.CategoriesComponent),
        data: { action: 'view' }
      }
    ]
  }
];
