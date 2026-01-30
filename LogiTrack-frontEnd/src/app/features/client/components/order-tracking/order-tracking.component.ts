import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-tracking-container">
      <h1>📍 Suivi de Commande</h1>
      <p>Suivi de commande en construction...</p>
    </div>
  `,
  styles: [`
    .order-tracking-container {
      padding: 20px;
    }
  `]
})
export class OrderTrackingComponent {
  constructor() { }
}
