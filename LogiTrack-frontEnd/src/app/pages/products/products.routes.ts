import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../features/admin/admin-layout/admin-layout.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./products').then(m => m.ProductsComponent)
      }
    ]
  }
];
