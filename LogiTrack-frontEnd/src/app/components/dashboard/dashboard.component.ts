import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="logo">
            <h1>📦 LogiTrack</h1>
          </div>
          <nav class="main-nav">
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              🏠 Accueil
            </a>
            <a routerLink="/client" routerLinkActive="active">
              🛍️ Client
            </a>
            <a routerLink="/shop" routerLinkActive="active">
              🛒 Boutique
            </a>
          </nav>
          <div class="user-menu">
            <div class="user-info" *ngIf="currentUser">
              <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
              <span class="user-role">{{ getUserRoleLabel() }}</span>
            </div>
            <button (click)="logout()" class="logout-btn">
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="dashboard-main">
        <div class="welcome-section">
          <h2>Bienvenue {{ currentUser?.firstName || 'dans LogiTrack' }} ! 👋</h2>
          <p class="welcome-subtitle">Votre plateforme de gestion logistique complète</p>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-content">
              <h3>Commandes Actives</h3>
              <div class="stat-number">{{ stats.activeOrders }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🚚</div>
            <div class="stat-content">
              <h3>En Livraison</h3>
              <div class="stat-number">{{ stats.inDelivery }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <h3>Livrées Aujourd'hui</h3>
              <div class="stat-number">{{ stats.deliveredToday }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>Total ce Mois</h3>
              <div class="stat-number">{{ stats.monthlyTotal }}</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions-section">
          <h3>Actions Rapides</h3>
          <div class="actions-grid">
            <a routerLink="/client/orders/new" class="action-card">
              <div class="action-icon">📋</div>
              <h4>Nouvelle Commande</h4>
              <p>Créer une nouvelle commande rapidement</p>
            </a>

            <a routerLink="/client/catalog" class="action-card">
              <div class="action-icon">🔍</div>
              <h4>Parcourir Catalogue</h4>
              <p>Explorer nos produits disponibles</p>
            </a>

            <a routerLink="/client/orders" class="action-card">
              <div class="action-icon">📄</div>
              <h4>Mes Commandes</h4>
              <p>Voir l'historique de vos commandes</p>
            </a>

            <a routerLink="/shop" class="action-card">
              <div class="action-icon">🛍️</div>
              <h4>Boutique</h4>
              <p>Accéder à la boutique en ligne</p>
            </a>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-section">
          <h3>Activit�� Récente</h3>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">📦</div>
              <div class="activity-content">
                <p><strong>Commande #2026-001</strong> a été expédiée</p>
                <span class="activity-time">Il y a 2 heures</span>
              </div>
              <div class="activity-status status-shipped">Expédiée</div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">✅</div>
              <div class="activity-content">
                <p><strong>Commande #2026-002</strong> a été livrée</p>
                <span class="activity-time">Il y a 4 heures</span>
              </div>
              <div class="activity-status status-delivered">Livrée</div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">📋</div>
              <div class="activity-content">
                <p><strong>Nouvelle commande</strong> créée par {{ currentUser?.firstName || 'vous' }}</p>
                <span class="activity-time">Il y a 6 heures</span>
              </div>
              <div class="activity-status status-pending">En cours</div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="dashboard-footer">
        <p>&copy; 2026 LogiTrack. Tous droits réservés.</p>
      </footer>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f8f9fa;
      display: flex;
      flex-direction: column;
    }

    .dashboard-header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
    }

    .logo h1 {
      margin: 0;
      color: #667eea;
      font-size: 24px;
      font-weight: 700;
    }

    .main-nav {
      display: flex;
      gap: 30px;
    }

    .main-nav a {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 20px;
      transition: all 0.3s;
    }

    .main-nav a:hover,
    .main-nav a.active {
      color: #667eea;
      background-color: #f0f4ff;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-info {
      text-align: right;
    }

    .user-name {
      display: block;
      font-weight: 600;
      color: #333;
    }

    .user-role {
      display: block;
      font-size: 12px;
      color: #666;
    }

    .logout-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .logout-btn:hover {
      background: #5a6fd8;
    }

    .dashboard-main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
      width: 100%;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .welcome-section h2 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 32px;
      font-weight: 600;
    }

    .welcome-subtitle {
      color: #666;
      font-size: 18px;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-icon {
      font-size: 40px;
      margin-right: 16px;
    }

    .stat-content h3 {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-number {
      font-size: 28px;
      font-weight: bold;
      color: #333;
    }

    .actions-section {
      margin-bottom: 40px;
    }

    .actions-section h3 {
      margin-bottom: 20px;
      color: #333;
      font-weight: 600;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .action-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      text-align: center;
    }

    .action-card:hover {
      transform: translateY(-4px);
      text-decoration: none;
      color: inherit;
    }

    .action-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .action-card h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-weight: 600;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .activity-section {
      margin-bottom: 40px;
    }

    .activity-section h3 {
      margin-bottom: 20px;
      color: #333;
      font-weight: 600;
    }

    .activity-list {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .activity-item {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e9ecef;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      font-size: 24px;
      margin-right: 16px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content p {
      margin: 0 0 4px 0;
      font-weight: 500;
      color: #333;
    }

    .activity-time {
      font-size: 12px;
      color: #666;
    }

    .activity-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-shipped {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .status-delivered {
      background-color: #d4edda;
      color: #155724;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .dashboard-footer {
      background: white;
      border-top: 1px solid #e9ecef;
      padding: 20px;
      text-align: center;
      color: #666;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }

      .main-nav {
        justify-content: center;
        flex-wrap: wrap;
      }

      .user-menu {
        justify-content: center;
      }

      .dashboard-main {
        padding: 20px 15px;
      }

      .welcome-section h2 {
        font-size: 24px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;

  stats = {
    activeOrders: 12,
    inDelivery: 8,
    deliveredToday: 15,
    monthlyTotal: 127
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    // Si pas d'utilisateur connecté, créer un utilisateur demo
    if (!this.currentUser) {
      this.currentUser = {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@logitrack.com',
        role: 'CLIENT'
      };
    }
  }

  getUserRoleLabel(): string {
    if (!this.currentUser) return '';

    switch (this.currentUser.role) {
      case 'ADMIN': return 'Administrateur';
      case 'WAREHOUSE_MANAGER': return 'Manager';
      case 'CLIENT': return 'Client';
      default: return this.currentUser.role;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
