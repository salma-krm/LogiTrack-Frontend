import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent],
  template: `
    <div class="admin-layout">
      <!-- Sidebar admin globale et fixe -->
      <app-admin-sidebar></app-admin-sidebar>

      <!-- Contenu principal -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    /* Contenu principal avec marge pour la sidebar */
    .main-content {
      margin-left: 250px;
      flex: 1;
      min-height: 100vh;
      background-color: #f5f7fa;
      padding: 24px;
    }
  `]
})
export class AdminLayoutComponent {
}
