import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { ProductService, Product } from '../services/product.service';
import { WarehouseService, Warehouse } from '../services/warehouse.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  isLoading = false;
  warehousesLoading = false;
  error = '';
  warehouseError = '';

  // Statistics
  get activeWarehouses() {
    return this.warehouses.filter(w => w.active).length;
  }

  get totalWarehouses() {
    return this.warehouses.length;
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private productService: ProductService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadWarehouses();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.filter(p => p.active).slice(0, 6);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des produits';
        this.isLoading = false;
      }
    });
  }

  loadWarehouses() {
    this.warehousesLoading = true;
    this.warehouseService.getAllWarehouses().subscribe({
      next: (data: Warehouse[]) => {
        this.warehouses = data.slice(0, 4); // Afficher 4 entrepôts max sur le dashboard
        this.warehousesLoading = false;
      },
      error: (err: any) => {
        this.warehouseError = 'Erreur lors du chargement des entrepôts';
        this.warehousesLoading = false;
        console.error('Error loading warehouses:', err);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToShop() {
    this.router.navigate(['/dashboard/shop']);
  }

  goToWarehouses() {
    this.router.navigate(['/dashboard/warehouses']);
  }
}
