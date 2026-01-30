import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="client-dashboard">
      <div class="dashboard-header">
        <h1>🏠 Tableau de Bord Client</h1>
        <p class="welcome-message">Bienvenue dans votre espace LogiTrack</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>Commandes Actives</h3>
            <span class="stat-number">5</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚚</div>
          <div class="stat-content">
            <h3>En Livraison</h3>
            <span class="stat-number">2</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Livrées</h3>
            <span class="stat-number">12</span>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Actions Rapides</h2>
        <div class="action-cards">
          <a routerLink="/client/catalog" class="action-card">
            <div class="action-icon">🛍️</div>
            <h3>Parcourir le Catalogue</h3>
            <p>Découvrez nos produits</p>
          </a>

          <a routerLink="/client/orders/new" class="action-card">
            <div class="action-icon">📋</div>
            <h3>Nouvelle Commande</h3>
            <p>Créer une nouvelle commande</p>
          </a>

          <a routerLink="/client/orders" class="action-card">
            <div class="action-icon">📊</div>
            <h3>Mes Commandes</h3>
            <p>Voir l'historique des commandes</p>
          </a>

          <a routerLink="/client/cart" class="action-card">
            <div class="action-icon">🛒</div>
            <h3>Mon Panier</h3>
            <p>Voir le panier actuel</p>
          </a>
        </div>
      </div>

      <div class="recent-orders">
        <h2>Commandes Récentes</h2>
        <div class="orders-list">
          <div class="order-item">
            <div class="order-info">
              <span class="order-number">#CMD-2026-001</span>
              <span class="order-date">26 Jan 2026</span>
            </div>
            <div class="order-status status-pending">En cours</div>
            <div class="order-amount">€ 248.50</div>
          </div>

          <div class="order-item">
            <div class="order-info">
              <span class="order-number">#CMD-2026-002</span>
              <span class="order-date">25 Jan 2026</span>
            </div>
            <div class="order-status status-shipped">Expédiée</div>
            <div class="order-amount">€ 156.30</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .dashboard-header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 600;
    }

    .welcome-message {
      margin: 0;
      font-size: 18px;
      opacity: 0.9;
    }

    .dashboard-stats {
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

    .quick-actions {
      margin-bottom: 40px;
    }

    .quick-actions h2 {
      margin-bottom: 20px;
      color: #333;
      font-weight: 600;
    }

    .action-cards {
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

    .action-card h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-weight: 600;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .recent-orders h2 {
      margin-bottom: 20px;
      color: #333;
      font-weight: 600;
    }

    .orders-list {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .order-item {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e9ecef;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .order-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .order-number {
      font-weight: 600;
      color: #333;
    }

    .order-date {
      color: #666;
      font-size: 14px;
    }

    .order-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      margin-right: 16px;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-shipped {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .order-amount {
      font-weight: 600;
      color: #27ae60;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .client-dashboard {
        padding: 10px;
      }

      .dashboard-stats {
        grid-template-columns: 1fr;
      }

      .action-cards {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .order-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .order-status {
        margin-right: 0;
      }
    }
  `]
})
export class ClientDashboardComponent {
  constructor() { }
}
