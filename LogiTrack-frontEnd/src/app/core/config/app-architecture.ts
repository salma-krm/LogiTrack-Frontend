// Angular 20 Application Structure
export interface AppArchitecture {
  core: {
    auth: 'JWT Access/Refresh tokens';
    guards: 'AuthGuard + RoleGuard';
    interceptors: 'AuthInterceptor + RefreshTokenInterceptor';
    layout: 'Layout sécurisé par rôle';
  };
  shared: {
    components: 'Tables, Dialogs, Snackbar réutilisables';
    services: 'Services communs';
  };
  features: {
    admin: 'Gestion utilisateurs, produits, entrepôts';
    warehouse: 'Inventaire, mouvements, expéditions';
    client: 'Catalogue, commandes, tracking';
  };
  api: {
    services: 'Services Angular par ressource backend';
  };
}

// Endpoints mappés depuis l'API backend
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  WAREHOUSES: '/api/warehouses',
  INVENTORY: '/api/inventory',
  SALES_ORDERS: '/api/sales-orders'
} as const;
