import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-simple-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>🔐 Connexion LogiTrack</h2>
        <p class="subtitle">Connectez-vous à votre compte</p>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <input
              type="email"
              class="form-control"
              formControlName="email"
              placeholder="Entrez votre email">
          </div>

          <div class="form-group">
            <input
              type="password"
              class="form-control"
              formControlName="password"
              placeholder="Entrez votre mot de passe">
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="demo-section">
          <p style="text-align: center; color: #666; margin: 20px 0 10px;">Comptes de test</p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button (click)="loginDemo('admin')" class="demo-btn">
              👨‍💼 Admin
            </button>
            <button (click)="loginDemo('client')" class="demo-btn">
              🛍️ Client
            </button>
          </div>
        </div>

        <div class="logout-section" *ngIf="isLoggedIn()">
          <button (click)="logout()" class="logout-btn">
            🚪 Se déconnecter
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #e8d5ff 0%, #d4c5f9 100%);
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .login-card {
      background: white;
      padding: 40px 30px;
      border-radius: 25px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 350px;
    }

    .login-card h2 {
      text-align: center;
      color: #333;
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: 600;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
      padding: 15px 20px;
      border: 1px solid #e1e5e9;
      border-radius: 15px;
      font-size: 16px;
      background: #f8f9fa;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #b99dfa;
      background: white;
    }

    .btn-primary {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #b99dfa 0%, #9575cd 100%);
      color: white;
      border: none;
      border-radius: 15px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
    }

    .demo-btn {
      padding: 8px 12px;
      background: #f8f9fa;
      border: 1px solid #e1e5e9;
      border-radius: 10px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .demo-btn:hover {
      background: #e9ecef;
    }

    .logout-btn {
      width: 100%;
      padding: 12px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 15px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 15px;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .alert {
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 20px;
      text-align: center;
    }

    .alert-error {
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }
  `]
})
export class SimpleLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login réussi:', response);

          // Rediriger en fonction du rôle
          const user: any = (response as any).user ?? response;
          const role = user?.role;

          if (!role) {
            console.warn('Aucun rôle trouvé dans la réponse, redirection vers le tableau de bord par défaut.');
            this.router.navigate(['/dashboard']);
            return;
          }

          switch (role) {
            case 'ADMIN':
              this.router.navigate(['/admin/dashboard']);
              break;
            case 'MANAGER':
              this.router.navigate(['/warehouses']);
              break;
            case 'CLIENT':
              this.router.navigate(['/client/dashboard']);
              break;
            default:
              this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur de connexion:', error);
          this.errorMessage = error.message || 'Identifiants incorrects. Veuillez réessayer.';
        }
      });
    }
  }

  loginDemo(role: 'admin' | 'client') {
    const credentials = {
      admin: { email: 'admin@logitrack.com', password: 'admin123' },
      client: { email: 'client@logitrack.com', password: 'client123' }
    };

    this.loginForm.patchValue(credentials[role]);
    this.onLogin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
