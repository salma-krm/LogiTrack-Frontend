import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  currentUser: any = null;
  isCollapsed = false;
  isMobileMenuOpen = false;

  menuItems: MenuItem[] = [
    {
      label: 'Tableau de bord',
      icon: '📊',
      route: '/dashboard',
      roles: ['ADMIN', 'MANAGER', 'CLIENT']
    },
    {
      label: 'Categories',
      icon: '🏷️',
      route: '/categories',
      roles: ['ADMIN', 'MANAGER']
    },
    {
      label: 'Warehouses',
      icon: '🏭',
      route: '/warehouses',
      roles: ['ADMIN', 'MANAGER']
    },
    {
      label: 'Inventory',
      icon: '📦',
      route: '/inventory',
      roles: ['ADMIN', 'MANAGER', 'CLIENT']
    },
    {
      label: 'Products',
      icon: '📋',
      route: '/products',
      roles: ['ADMIN', 'MANAGER']
    },
    {
      label: 'Commandes',
      icon: '🛒',
      route: '/client/orders',
      roles: ['ADMIN', 'MANAGER', 'CLIENT']
    }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
  }

  get filteredMenuItems(): MenuItem[] {
    if (!this.currentUser) return this.menuItems;
    return this.menuItems.filter(item =>
      !item.roles || item.roles.includes(this.currentUser.role)
    );
  }

  get userInitials(): string {
    if (!this.currentUser) return 'U';
    const first = this.currentUser.firstName?.charAt(0) || '';
    const last = this.currentUser.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
