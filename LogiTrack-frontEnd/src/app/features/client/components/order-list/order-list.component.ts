import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-list-container">
      <h1>📋 Liste des Commandes</h1>
      <p>Liste des commandes en construction...</p>
    </div>
  `,
  styles: [`
    .order-list-container {
      padding: 20px;
    }
  `]
})
export class OrderListComponent {
  constructor() { }
}
