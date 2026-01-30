import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
      position: relative;
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-height: 100vh;
      width: 100%;
    }

    .content-wrapper {
      padding: 32px;
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
    }

    /* Responsive - Tablette */
    @media (max-width: 1024px) {
      .main-content {
        margin-left: 260px;
      }

      .content-wrapper {
        padding: 24px;
      }
    }

    /* Responsive - Mobile */
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding-top: 80px; /* Espace pour le bouton hamburger */
      }

      .content-wrapper {
        padding: 20px 16px;
      }
    }

    @media (max-width: 480px) {
      .content-wrapper {
        padding: 16px 12px;
      }
    }
  `]
})
export class LayoutComponent {}
