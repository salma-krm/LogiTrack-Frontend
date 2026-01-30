# 🎨 LogiTrack Design System

## 📋 Vue d'ensemble

Ce document décrit le système de design unifié pour l'application LogiTrack, avec une couleur principale **#B99DFA** utilisée de manière cohérente sur toutes les pages.

## 🎯 Couleur Principale

### Palette de couleurs
- **Primaire**: `#B99DFA` (Violet clair)
- **Primaire Hover**: `#a78ae8`
- **Primaire Light**: `#d4c5f9`
- **Primaire Dark**: `#9a7ee5`
- **Gradient**: `linear-gradient(135deg, #B99DFA 0%, #a78ae8 100%)`

### Couleurs Secondaires
- **Success**: `#10b981` (Vert)
- **Danger**: `#ef4444` (Rouge)
- **Warning**: `#f59e0b` (Orange)

### Couleurs de Texte
- **Dark**: `#1f2937`
- **Medium**: `#6b7280`
- **Light**: `#9ca3af`

### Couleurs de Fond
- **Light**: `#f9fafb`
- **White**: `#ffffff`
- **Border**: `#e5e7eb`

## 🧩 Composants

### 1. Boutons

#### Bouton Primary
```css
.btn-primary {
  background: var(--primary-gradient);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}
```

#### Bouton Secondary
```css
.btn-secondary {
  background: var(--primary-light);
  color: var(--primary-dark);
}
```

#### Bouton Danger
```css
.btn-danger {
  background: var(--danger-color);
  color: white;
}
```

### 2. Badges

```css
.badge-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.badge-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.badge-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
```

### 3. Cards Statistiques

- Bordure gauche colorée avec la couleur principale
- Effet hover avec `transform: translateY(-4px)`
- Ombres douces et modernes
- Icônes emoji pour une meilleure lisibilité

### 4. Tables

- **Header**: Gradient violet (#B99DFA)
- **Hover**: Fond rgba(185, 157, 250, 0.05)
- **Bordures**: Couleur #e5e7eb
- **Texte**: Couleurs cohérentes avec le design system

### 5. Modals

- **Header**: Gradient violet avec texte blanc
- **Body**: Fond blanc avec padding généreux
- **Footer**: Fond gris clair avec boutons alignés à droite
- **Animation**: Slide-up de 30px avec fade-in

### 6. Inputs

```css
.form-control {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 14px;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(185, 157, 250, 0.1);
}
```

## 📄 Pages Implémentées

### ✅ Products Page (`/products`)
- Liste complète des produits avec SKU, nom, prix, catégorie, statut
- Statistiques: Total produits, Actifs, Inactifs
- Filtres: Recherche par nom/SKU, Filtre par catégorie
- Actions: Ajouter, Modifier, Supprimer
- Modal pour création/édition

### ✅ Inventory Page (`/inventory`)
- Gestion des stocks par entrepôt
- Statistiques: Total inventaires, Stock faible, Rupture
- Filtres: Recherche, Entrepôt, Produit
- Colonnes: ID, Produit, Entrepôt, Qté en stock, Qté réservée, Disponible, Statut
- Actions: Ajouter, Modifier, Supprimer
- Modal pour création/édition

### ✅ Categories Page (`/categories`)
- Gestion des catégories de produits
- Table simple avec actions CRUD
- Design cohérent avec les autres pages

## 🎨 Principes de Design

1. **Cohérence**: Même couleur principale (#B99DFA) sur toutes les pages
2. **Clarté**: Hiérarchie visuelle claire avec des espacements généreux
3. **Modernité**: Coins arrondis (8-12px), ombres douces, transitions fluides
4. **Accessibilité**: Contrastes suffisants, tailles de police lisibles
5. **Responsive**: Adaptation mobile avec media queries
6. **Performance**: Animations légères (0.3s ease)

## 📱 Responsive Design

- **Desktop**: Layout optimal avec colonnes multiples
- **Tablet**: Adaptation des grilles et filtres
- **Mobile**: 
  - Headers en colonne
  - Tables avec scroll horizontal
  - Boutons en pleine largeur
  - Modal pleine hauteur

## 🚀 Utilisation

### Variables CSS Globales
Toutes les variables sont définies dans `src/styles.css` et disponibles via `var(--nom-variable)`.

### Classes Utilitaires
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.badge`, `.badge-success`, `.badge-danger`, `.badge-warning`
- `.form-control`
- `.modal-overlay`, `.modal`, `.modal-header`, `.modal-body`, `.modal-footer`

## ✨ Animations

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## 📊 Structure des Fichiers

```
src/
├── styles.css (Variables globales et styles de base)
├── app/
│   └── pages/
│       ├── products/
│       │   ├── products.ts
│       │   ├── products.html
│       │   └── products.css
│       ├── inventory/
│       │   ├── inventory.ts
│       │   ├── inventory.html
│       │   └── inventory.css
│       └── categories/
│           ├── categories.ts (existant)
│           ├── categories.html (existant)
│           └── categories.css (mis à jour)
```

## 🎯 Résultat Final

✅ Design unifié et professionnel  
✅ Couleur principale #B99DFA partout  
✅ Composants réutilisables  
✅ Expérience utilisateur fluide  
✅ Responsive et accessible  
✅ Code maintenable et cohérent  

---

**LogiTrack** - Système de gestion d'inventaire moderne 📦
