import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { SalesOrderService, SalesOrderRequest, SalesOrderLineRequest } from '../../services/sales-order.service';
import { WarehouseService, Warehouse } from '../../services/warehouse.service';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  warehouses: Warehouse[] = [];
  cart: CartItem[] = [];

  searchTerm = '';
  selectedWarehouseId: number | null = null;

  showCart = false;
  showOrderModal = false;
  orderNotes = '';

  isLoading = false;
  error = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private salesOrderService: SalesOrderService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadWarehouses();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.filter(p => p.active);
        this.filteredProducts = [...this.products];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des produits';
        this.isLoading = false;
      }
    });
  }

  loadWarehouses() {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (data: Warehouse[]) => {
        this.warehouses = data;
        if (this.warehouses.length > 0) {
          this.selectedWarehouseId = this.warehouses[0].id;
        }
      },
      error: (err: any) => {
        console.error('Erreur chargement entrepôts:', err);
      }
    });
  }

  applyFilter() {
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addToCart(product: Product) {
    const existingItem = this.cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    this.successMessage = `${product.name} ajouté au panier`;
    setTimeout(() => this.successMessage = '', 2000);
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  updateQuantity(index: number, quantity: number) {
    if (quantity > 0) {
      this.cart[index].quantity = quantity;
    } else {
      this.removeFromCart(index);
    }
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => {
      const price = item.product.originalPrice + item.product.profit;
      return total + (price * item.quantity);
    }, 0);
  }

  getCartItemCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  openOrderModal() {
    if (this.cart.length === 0) {
      this.error = 'Votre panier est vide';
      return;
    }
    if (!this.selectedWarehouseId) {
      this.error = 'Veuillez sélectionner un entrepôt';
      return;
    }
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.orderNotes = '';
  }

  submitOrder() {
    if (!this.selectedWarehouseId) {
      this.error = 'Veuillez sélectionner un entrepôt';
      return;
    }

    const orderLines: SalesOrderLineRequest[] = this.cart.map(item => ({
      productId: item.product.id!,
      quantity: item.quantity,
      unitPrice: item.product.originalPrice + item.product.profit
    }));

    const orderRequest: SalesOrderRequest = {
      warehouseId: this.selectedWarehouseId,
      notes: this.orderNotes,
      orderLines: orderLines
    };

    this.isLoading = true;
    this.salesOrderService.createOrder(orderRequest).subscribe({
      next: (response: any) => {
        this.successMessage = `Commande ${response.orderNumber} créée avec succès!`;
        this.cart = [];
        this.closeOrderModal();
        this.showCart = false;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = err.message || 'Erreur lors de la création de la commande';
        this.isLoading = false;
      }
    });
  }
}
