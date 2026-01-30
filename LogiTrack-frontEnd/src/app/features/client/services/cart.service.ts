import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../../api/services/product-api.service';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.getEmptyCart());
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private getEmptyCart(): Cart {
    return {
      items: [],
      totalItems: 0,
      totalAmount: 0,
      lastUpdated: new Date()
    };
  }

  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('shopping_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Validate cart structure
          if (parsedCart.items && Array.isArray(parsedCart.items)) {
            this.cartSubject.next(parsedCart);
          }
        } catch (error) {
          console.warn('Error loading cart from storage:', error);
          this.clearCart();
        }
      }
    }
  }

  private saveCartToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopping_cart', JSON.stringify(this.cartSubject.value));
    }
  }

  private updateCart(): void {
    const currentCart = this.cartSubject.value;
    const updatedCart: Cart = {
      ...currentCart,
      totalItems: currentCart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: currentCart.items.reduce((sum, item) =>
        sum + ((item.product.originalPrice + item.product.profit) * item.quantity), 0
      ),
      lastUpdated: new Date()
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  addToCart(product: Product, quantity: number = 1): boolean {
    if (!product.active) {
      return false;
    }

    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      // Update existing item
      currentCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      currentCart.items.push({
        product,
        quantity,
        addedAt: new Date()
      });
    }

    this.updateCart();
    return true;
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): boolean {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return true;
    }

    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.items.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      currentCart.items[itemIndex].quantity = quantity;
      this.updateCart();
      return true;
    }

    return false;
  }

  clearCart(): void {
    this.cartSubject.next(this.getEmptyCart());
    this.saveCartToStorage();
  }

  getCart(): Observable<Cart> {
    return this.cart$;
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  getItemCount(): number {
    return this.cartSubject.value.totalItems;
  }

  getTotalAmount(): number {
    return this.cartSubject.value.totalAmount;
  }

  isInCart(productId: number): boolean {
    return this.cartSubject.value.items.some(item => item.product.id === productId);
  }

  getItemQuantity(productId: number): number {
    const item = this.cartSubject.value.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  // Validation methods for business rules
  validateCart(): { valid: boolean; errors: string[] } {
    const cart = this.getCurrentCart();
    const errors: string[] = [];

    if (cart.items.length === 0) {
      errors.push('Le panier est vide');
    }

    // Check if products are still active
    cart.items.forEach(item => {
      if (!item.product.active) {
        errors.push(`Le produit ${item.product.name} n'est plus disponible`);
      }
    });

    // Check minimum order amount (business rule)
    const minOrderAmount = 50; // Could be configurable
    if (cart.totalAmount < minOrderAmount) {
      errors.push(`Montant minimum de commande: ${minOrderAmount}€`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Convert cart to order format
  toOrderFormat(warehouseId: number, notes?: string) {
    const cart = this.getCurrentCart();
    return {
      warehouseId,
      notes: notes || '',
      orderLines: cart.items
        .filter(item => item.product.id !== undefined)
        .map(item => ({
          productId: item.product.id!,
          quantity: item.quantity,
          unitPrice: item.product.originalPrice + item.product.profit
        }))
    };
  }
}
