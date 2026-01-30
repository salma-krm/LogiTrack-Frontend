import { Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

// Composants pour les pages d'erreur et de redirection
@Component({
  selector: 'app-role-dashboard',
  template: `<div class="loading-redirect">
    <div class="spinner"></div>
    <p>Redirection en cours...</p>
  </div>`,
  styles: [`
    .loading-redirect {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `],
  standalone: true
})
export class RoleDashboardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    switch (user.role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'MANAGER':
        this.router.navigate(['/warehouse/dashboard']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client/dashboard']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}

@Component({
  selector: 'app-access-denied',
  template: `
    <div class="error-page">
      <h1>🚫 Accès Refusé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <button (click)="goBack()" class="btn btn-primary">Retour</button>
    </div>
  `,
  styles: [`
    .error-page {
      text-align: center;
      padding: 60px 20px;
    }
    .btn {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `],
  standalone: true
})
export class AccessDeniedComponent {
  goBack() {
    window.history.back();
  }
}

@Component({
  selector: 'app-not-found',
  template: `
    <div class="error-page">
      <h1>🔍 Page Non Trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <button (click)="goHome()" class="btn btn-primary">Accueil</button>
    </div>
  `,
  styles: [`
    .error-page {
      text-align: center;
      padding: 60px 20px;
    }
    .btn {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `],
  standalone: true
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}

export const routes: Routes = [
  // Route par défaut - redirection vers login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Route de login simple
  {
    path: 'login',
    loadComponent: () => import('./simple-login.component').then(m => m.SimpleLoginComponent)
  },

  // Routes d'authentification alternatives
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./simple-login.component').then(m => m.SimpleLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/components/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },

  // Route dashboard principale
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // Routes ADMIN avec lazy loading
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // Routes CLIENT avec lazy loading
  {
    path: 'client',
    loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
  },

  // Routes PRODUCTS avec lazy loading
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.routes').then(m => m.PRODUCTS_ROUTES)
  },

  // Routes INVENTORY avec lazy loading
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES)
  },

  // Routes WAREHOUSES avec lazy loading
  {
    path: 'warehouses',
    loadChildren: () => import('./pages/warehouses/warehouses.routes').then(m => m.WAREHOUSES_ROUTES)
  },

  // Routes CATEGORIES avec lazy loading
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.routes').then(m => m.CATEGORIES_ROUTES)
  },

  // Route temporaire pour les tests
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop').then(m => m.ShopComponent)
  },

  // Route d'accueil temporaire
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.HomeComponent)
  },

  // Pages d'erreur
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '404', component: NotFoundComponent },

  // Fallback pour toutes les routes non trouvées
  { path: '**', redirectTo: '/login' }
];
