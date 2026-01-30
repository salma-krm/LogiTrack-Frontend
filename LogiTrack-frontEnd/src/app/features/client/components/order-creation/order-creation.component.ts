import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService, Cart, CartItem } from '../../services/cart.service';
import { SalesOrderApiService } from '../../../../api/services/sales-order-api.service';
import { ProductApiService } from '../../../../api/services/product-api.service';
import { WarehouseService } from '../../../../services/warehouse.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-order-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="order-creation-container">
      <div class="page-header">
        <h1>📋 Nouvelle Commande</h1>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="goToCart()">
            🛒 Voir le panier ({{ cart.totalItems }})
          </button>
          <button class="btn btn-primary" (click)="continueShopping()">
            🛍️ Continuer les achats
          </button>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary-section">
        <div class="section-header">
          <h2>📦 Récapitulatif du Panier</h2>
          <div class="cart-total">
            <span class="total-amount">{{ cart.totalAmount | currency:'EUR' }}</span>
            <span class="total-items">({{ cart.totalItems }} articles)</span>
          </div>
        </div>

        <div class="cart-items" *ngIf="cart.items.length > 0">
          <div class="cart-item" *ngFor="let item of cart.items; trackBy: trackByProductId">
            <div class="item-info">
              <div class="product-image">📦</div>
              <div class="product-details">
                <h4>{{ item.product.name }}</h4>
                <p class="sku">SKU: {{ item.product.sku }}</p>
                <p class="price">{{ getItemPrice(item.product) | currency:'EUR' }} / unité</p>
              </div>
            </div>

            <div class="quantity-controls">
              <button
                class="btn-quantity"
                (click)="updateQuantity(item.product.id!, item.quantity - 1)"
                [disabled]="processing || !item.product.id">
                −
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button
                class="btn-quantity"
                (click)="updateQuantity(item.product.id!, item.quantity + 1)"
                [disabled]="processing || !item.product.id">
                +
              </button>
            </div>

            <div class="item-total">
              {{ (getItemPrice(item.product) * item.quantity) | currency:'EUR' }}
            </div>

            <button
              class="btn-remove"
              (click)="removeItem(item.product.id!)"
              [disabled]="processing || !item.product.id"
              title="Supprimer">
              🗑️
            </button>
          </div>
        </div>

        <div class="empty-cart" *ngIf="cart.items.length === 0">
          <div class="empty-icon">🛒</div>
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des produits pour créer une commande.</p>
          <button class="btn btn-primary" (click)="continueShopping()">
            Parcourir le catalogue
          </button>
        </div>
      </div>

      <!-- Order Form -->
      <div class="order-form-section" *ngIf="cart.items.length > 0">
        <div class="section-header">
          <h2>📋 Informations de Commande</h2>
        </div>

        <form [formGroup]="orderForm" (ngSubmit)="submitOrder()" class="order-form">
          <div class="form-row">
            <div class="form-group">
              <label for="warehouse">Entrepôt de livraison *</label>
              <select
                id="warehouse"
                formControlName="warehouseId"
                class="form-control"
                [class.error]="orderForm.get('warehouseId')?.invalid && orderForm.get('warehouseId')?.touched">
                <option value="">Sélectionner un entrepôt</option>
                <option *ngFor="let warehouse of warehouses" [value]="warehouse.id">
                  {{ warehouse.name }}
                </option>
              </select>
              <div class="error-message"
                   *ngIf="orderForm.get('warehouseId')?.invalid && orderForm.get('warehouseId')?.touched">
                Veuillez sélectionner un entrepôt
              </div>
            </div>

            <div class="form-group">
              <label for="priority">Priorité</label>
              <select id="priority" formControlName="priority" class="form-control">
                <option value="NORMAL">Normale</option>
                <option value="HIGH">Haute</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="notes">Notes et instructions</label>
            <textarea
              id="notes"
              formControlName="notes"
              class="form-control"
              rows="4"
              placeholder="Instructions spéciales, adresse de livraison, créneaux horaires...">
            </textarea>
          </div>

          <!-- Business Rules Alerts -->
          <div class="business-rules-alerts" *ngIf="validationErrors.length > 0">
            <div class="alert alert-warning">
              <h4>⚠️ Attention</h4>
              <ul>
                <li *ngFor="let error of validationErrors">{{ error }}</li>
              </ul>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <div class="summary-row">
              <span>Sous-total:</span>
              <span>{{ cart.totalAmount | currency:'EUR' }}</span>
            </div>
            <div class="summary-row">
              <span>TVA (20%):</span>
              <span>{{ getTaxAmount() | currency:'EUR' }}</span>
            </div>
            <div class="summary-row total">
              <span>Total TTC:</span>
              <span>{{ getTotalWithTax() | currency:'EUR' }}</span>
            </div>
          </div>

          <!-- Submit Actions -->
          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="saveDraft()"
              [disabled]="processing">
              💾 Sauvegarder comme brouillon
            </button>

            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="orderForm.invalid || processing || validationErrors.length > 0">
              <span *ngIf="processing" class="spinner-small"></span>
              {{ processing ? 'Création en cours...' : '✅ Créer la commande' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Cut-off Time Alert -->
      <div class="cutoff-alert" *ngIf="showCutoffAlert">
        <div class="alert alert-info">
          <h4>⏰ Information Livraison</h4>
          <p>
            Commandes passées avant <strong>16h00</strong> : livraison le lendemain.<br>
            Commandes passées après 16h00 : livraison sous 48h.
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./order-creation.component.css']
})
export class OrderCreationComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [], totalItems: 0, totalAmount: 0, lastUpdated: new Date() };
  warehouses: any[] = [];
  orderForm: FormGroup;
  processing = false;
  validationErrors: string[] = [];
  showCutoffAlert = true;

  private subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private salesOrderService: SalesOrderApiService,
    private warehouseService: WarehouseService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      warehouseId: ['', Validators.required],
      notes: [''],
      priority: ['NORMAL']
    });
  }

  ngOnInit() {
    // Subscribe to cart changes
    this.subscription.add(
      this.cartService.cart$.subscribe(cart => {
        this.cart = cart;
        this.validateCart();
      })
    );

    // Load warehouses
    this.loadWarehouses();

    // Validate cart initially
    this.validateCart();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadWarehouses() {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses.filter(w => w.active);
      },
      error: (error) => {
        this.notificationService.handleApiError(error);
      }
    });
  }

  private validateCart() {
    const validation = this.cartService.validateCart();
    this.validationErrors = validation.errors;
  }

  updateQuantity(productId: number, newQuantity: number) {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.notificationService.info('Produit supprimé du panier');
  }

  getItemPrice(product: any): number {
    return product.originalPrice + product.profit;
  }

  getTaxAmount(): number {
    return this.cart.totalAmount * 0.20; // 20% TVA
  }

  getTotalWithTax(): number {
    return this.cart.totalAmount + this.getTaxAmount();
  }

  goToCart() {
    this.router.navigate(['/client/cart']);
  }

  continueShopping() {
    this.router.navigate(['/client/catalog']);
  }

  saveDraft() {
    if (this.orderForm.valid && this.cart.items.length > 0) {
      // Save to localStorage as draft
      const draft = {
        cart: this.cart,
        formData: this.orderForm.value,
        savedAt: new Date()
      };
      localStorage.setItem('order_draft', JSON.stringify(draft));
      this.notificationService.success('Brouillon sauvegardé');
    }
  }

  submitOrder() {
    if (this.orderForm.invalid || this.validationErrors.length > 0) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.processing = true;

    const orderData = this.cartService.toOrderFormat(
      this.orderForm.value.warehouseId,
      this.orderForm.value.notes
    );

    this.salesOrderService.createOrder(orderData).subscribe({
      next: (order: any) => {
        this.processing = false;

        // Clear cart after successful order
        this.cartService.clearCart();

        // Clear any saved draft
        localStorage.removeItem('order_draft');

        // Show success notification
        this.notificationService.orderCreated(order.orderNumber);

        // Redirect to order detail
        this.router.navigate(['/client/orders', order.id]);
      },
      error: (error: any) => {
        this.processing = false;
        this.notificationService.handleApiError(error);
      }
    });
  }

  trackByProductId = (index: number, item: CartItem) => item.product.id;
}
