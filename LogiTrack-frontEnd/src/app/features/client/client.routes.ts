import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/client-dashboard/client-dashboard.component').then(c => c.ClientDashboardComponent)
  },
  {
    path: 'catalog',
    loadComponent: () => import('./components/product-catalog/product-catalog.component').then(c => c.ProductCatalogComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/shopping-cart/shopping-cart.component').then(c => c.ShoppingCartComponent)
  },
  {
    path: 'orders',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/order-list/order-list.component').then(c => c.OrderListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./components/order-creation/order-creation.component').then(c => c.OrderCreationComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/order-detail/order-detail.component').then(c => c.OrderDetailComponent)
      },
      {
        path: ':id/tracking',
        loadComponent: () => import('./components/order-tracking/order-tracking.component').then(c => c.OrderTrackingComponent)
      }
    ]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/client-profile/client-profile.component').then(c => c.ClientProfileComponent)
  }
];
