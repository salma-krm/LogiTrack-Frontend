import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

interface MenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>LogiTrack Admin</h2>
        <span class="subtitle">Tableau de bord</span>
      </div>

      <nav class="sidebar-nav">
        <ul class="menu-list">
          <li *ngFor="let item of menuItems">
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              class="menu-link">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-button" (click)="onLogout()">
          Déconnexion
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .admin-sidebar {
      width: 250px;
      height: 100vh;
      background: #ffffff;
      border-right: 1px solid #e0e0e0;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
      z-index: 1000;
    }

    .sidebar-header {
      padding: 30px 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #f9f9f9;
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .subtitle {
      display: block;
      margin-top: 4px;
      font-size: 13px;
      color: #888;
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .menu-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .menu-list li {
      margin: 0;
    }

    .menu-link {
      display: block;
      padding: 15px 25px;
      color: #666;
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .menu-link:hover {
      background: #f5f5f5;
      color: #333;
      border-left-color: #ddd;
    }

    .menu-link.active {
      background: #f0f0f0;
      color: #000;
      border-left-color: #667eea;
      font-weight: 600;
    }

    .sidebar-footer {
      margin-top: auto;
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      background: #f9f9f9;
    }

    .logout-button {
      width: 100%;
      padding: 12px 16px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      background: #ffffff;
      color: #d32f2f;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-button:hover {
      background: #ffe5e5;
      border-color: #f5b5b5;
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
    }
  `]
})
export class AdminSidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Categories', route: '/categories' },
    { label: 'Warehouses', route: '/warehouses' },
    { label: 'Inventory', route: '/inventory' },
    { label: 'Products', route: '/products' }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
