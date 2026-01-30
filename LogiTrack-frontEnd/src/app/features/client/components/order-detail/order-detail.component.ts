import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-detail-container">
      <h1>📄 Détails de la Commande</h1>
      <p>Détails de commande en construction...</p>
    </div>
  `,
  styles: [`
    .order-detail-container {
      padding: 20px;
    }
  `]
})
export class OrderDetailComponent {
  constructor() { }
}
