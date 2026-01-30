import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="client-profile-container">
      <h1>👤 Profil Client</h1>
      <p>Profil client en construction...</p>
    </div>
  `,
  styles: [`
    .client-profile-container {
      padding: 20px;
    }
  `]
})
export class ClientProfileComponent {
  constructor() { }
}
