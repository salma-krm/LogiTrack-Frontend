import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="shopping-cart-container">
      <h1>🛒 Panier</h1>
      <p>Panier d'achat en construction...</p>
    </div>
  `,
  styles: [`
    .shopping-cart-container {
      padding: 20px;
    }
  `]
})
export class ShoppingCartComponent {
  constructor() { }
}
