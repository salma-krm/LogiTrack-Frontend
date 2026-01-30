import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../features/admin/admin-layout/admin-layout.component';

export const WAREHOUSES_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./warehouses.component').then(m => m.WarehousesComponent)
      },
      {
        path: 'list',
        loadComponent: () => import('./warehouses.component').then(m => m.WarehousesComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./warehouses.component').then(m => m.WarehousesComponent),
        data: { action: 'create' }
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./warehouses.component').then(m => m.WarehousesComponent),
        data: { action: 'edit' }
      },
      {
        path: 'view/:id',
        loadComponent: () => import('./warehouses.component').then(m => m.WarehousesComponent),
        data: { action: 'view' }
      },
      {
        path: ':id/inventory',
        loadComponent: () => import('./warehouses.component').then(m => m.WarehousesComponent),
        data: { action: 'inventory' }
      },
      {
        path: ':id/capacity',
        loadComponent: () => import('./warehouses.component').then(m => m.WarehousesComponent),
        data: { action: 'capacity' }
      }
    ]
  }
];
