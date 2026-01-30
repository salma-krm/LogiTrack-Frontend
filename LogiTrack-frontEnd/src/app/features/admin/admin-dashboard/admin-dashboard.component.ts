import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <h1>Admin Dashboard</h1>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>Categories</h3>
          <p>Manage product categories</p>
          <a routerLink="/categories" class="card-link">Go to Categories</a>
        </div>

        <div class="dashboard-card">
          <h3>Warehouses</h3>
          <p>Manage warehouse locations</p>
          <a routerLink="/warehouses" class="card-link">Go to Warehouses</a>
        </div>

        <div class="dashboard-card">
          <h3>Inventory</h3>
          <p>Track inventory levels</p>
          <a routerLink="/inventory" class="card-link">Go to Inventory</a>
        </div>

        <div class="dashboard-card">
          <h3>Products</h3>
          <p>Manage products</p>
          <a routerLink="/products" class="card-link">Go to Products</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
    }

    h1 {
      font-size: 32px;
      font-weight: 600;
      color: #333;
      margin-bottom: 30px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .dashboard-card {
      background: white;
      padding: 25px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      transition: all 0.2s ease;
    }

    .dashboard-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .dashboard-card h3 {
      margin: 0 0 10px 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .dashboard-card p {
      margin: 0 0 15px 0;
      color: #666;
      font-size: 14px;
    }

    .card-link {
      display: inline-block;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
    }

    .card-link:hover {
      text-decoration: underline;
    }
  `]
})
export class AdminDashboardComponent {}

