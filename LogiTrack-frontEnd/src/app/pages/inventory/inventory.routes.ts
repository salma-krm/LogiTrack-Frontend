import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../features/admin/admin-layout/admin-layout.component';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./inventory').then(m => m.InventoryComponent)
      },
      {
        path: 'list',
        loadComponent: () => import('./inventory').then(m => m.InventoryComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./inventory').then(m => m.InventoryComponent),
        data: { action: 'create' }
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./inventory').then(m => m.InventoryComponent),
        data: { action: 'edit' }
      },
      {
        path: 'view/:id',
        loadComponent: () => import('./inventory').then(m => m.InventoryComponent),
        data: { action: 'view' }
      },
      {
        path: 'movements/:id',
        loadComponent: () => import('./inventory').then(m => m.InventoryComponent),
        data: { action: 'movements' }
      },
      {
        path: 'warehouse/:warehouseId',
        loadComponent: () => import('./inventory').then(m => m.InventoryComponent),
        data: { action: 'by-warehouse' }
      },
      {
        path: 'product/:productId',
        loadComponent: () => import('./inventory').then(m => m.InventoryComponent),
        data: { action: 'by-product' }
      }
    ]
  }
];
