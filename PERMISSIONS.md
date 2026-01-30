# Configuration des Permissions - LogiTrack

## 📋 Résumé des Permissions Backend

D'après l'analyse du dossier `logitrackapi`, voici les permissions définies :

### Rôles disponibles
- **ADMIN** : Administrateur système
- **MANAGER** : Gestionnaire d'entrepôt
- **CLIENT** : Client

### Permissions par module

#### 1. **Products** (`/api/products`)
- **Lecture (GET)** : Tous (public)
- **Création (POST)** : `@RequireRole("ADMIN")`
- **Modification (PUT)** : `@RequireRole("ADMIN")`
- **Suppression (DELETE)** : `@RequireRole("ADMIN")`

#### 2. **Categories** (`/api/categories`)
- **Toutes opérations** : `@RequireRole("ADMIN")`
  - Création (POST)
  - Lecture (GET)
  - Modification (PUT)
  - Suppression (DELETE)

#### 3. **Warehouses** (`/api/warehouses`)
- **Toutes opérations** : `@RequireRole("MANAGER")`
  - Création (POST)
  - Lecture (GET)
  - Modification (PUT)
  - Suppression (DELETE)

#### 4. **Inventory** (`/api/inventories`)
- **Toutes opérations** : `@RequireAuth` (tous les utilisateurs authentifiés)

#### 5. **SalesOrders** (`/api/sales-orders`)
- **Création et gestion** : `@RequireRole("MANAGER")`

---

## 🔐 Configuration Frontend Appliquée

### Routes avec Guards

```typescript
// PRODUCTS - ADMIN uniquement
{
  path: 'products',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] }
}

// CATEGORIES - ADMIN uniquement
{
  path: 'categories',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] }
}

// WAREHOUSES - MANAGER et ADMIN
{
  path: 'warehouses',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['MANAGER', 'ADMIN'] }
}

// INVENTORY - Tous les utilisateurs authentifiés
{
  path: 'inventory',
  canActivate: [authGuard]
}
```

### Guards Configurés

1. **authGuard** : Vérifie que l'utilisateur est authentifié
   - Redirige vers `/auth/login` si non authentifié
   - Vérifie et rafraîchit le token si nécessaire

2. **roleGuard** : Vérifie que l'utilisateur a le rôle requis
   - Lit les rôles requis depuis `route.data['roles']`
   - Redirige vers `/access-denied` si le rôle ne correspond pas

3. **publicGuard** : Pour les pages publiques (login, register)
   - Redirige les utilisateurs déjà authentifiés vers leur dashboard

---

## 📊 Matrice de Permissions

| Module      | ADMIN | MANAGER | CLIENT | Public |
|------------|-------|---------|--------|--------|
| Products   | ✅ All | ❌     | 👁️ Read| 👁️ Read|
| Categories | ✅ All | ❌     | ❌     | ❌     |
| Warehouses | ✅ All | ✅ All | ❌     | ❌     |
| Inventory  | ✅ All | ✅ All | ✅ All | ���     |
| Orders     | ✅ All | ✅ All | ❌     | ❌     |

**Légende :**
- ✅ All = Toutes les opérations (CRUD)
- 👁️ Read = Lecture seule
- ❌ = Aucun accès

---

## 🔧 Fichiers Modifiés

### Frontend
1. **app.routes.ts** : Routes principales avec guards de sécurité
2. **products.routes.ts** : Routes des produits
3. **inventory.routes.ts** : Routes de l'inventaire
4. **warehouses.routes.ts** : Routes des entrepôts
5. **categories.routes.ts** : Routes des catégories
6. **auth.guards.ts** : Guards d'authentification et de rôle

---

## ✅ Points de Sécurité Implémentés

1. **Double vérification** : Guards frontend + annotations backend
2. **Session ID** : Transmission du Session-Id dans les headers
3. **Token refresh** : Rafraîchissement automatique des tokens
4. **Redirection intelligente** : Redirection basée sur le rôle utilisateur
5. **Pages d'erreur** : Pages dédiées pour accès refusé et 404

---

## 🚀 Utilisation

### Pour ajouter une nouvelle route protégée :

```typescript
{
  path: 'nouvelle-route',
  loadChildren: () => import('./nouvelle-route/routes').then(m => m.ROUTES),
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN', 'MANAGER'] } // Rôles autorisés
}
```

### Pour une route authentifiée sans restriction de rôle :

```typescript
{
  path: 'route-authentifiee',
  loadChildren: () => import('./route/routes').then(m => m.ROUTES),
  canActivate: [authGuard]
}
```

### Pour une route publique :

```typescript
{
  path: 'route-publique',
  loadComponent: () => import('./component').then(m => m.Component)
  // Pas de guard
}
```

