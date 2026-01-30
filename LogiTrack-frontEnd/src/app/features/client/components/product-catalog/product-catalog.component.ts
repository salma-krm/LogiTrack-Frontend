import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-catalog-container">
      <h1>📦 Catalogue des Produits</h1>
      <p>Catalogue des produits en construction...</p>
    </div>
  `,
  styles: [`
    .product-catalog-container {
      padding: 20px;
    }
  `]
})
export class ProductCatalogComponent {
  constructor() { }
}
