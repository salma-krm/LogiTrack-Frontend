import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Welcome back!</h2>
        <p class="subtitle">
          Don't have an account? <a routerLink="/auth/register">Sign up for free</a>
        </p>

        <!-- Messages d'erreur/succès -->
        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              class="form-control"
              formControlName="email"
              placeholder="Enter your email">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              class="form-control"
              formControlName="password"
              placeholder="Enter your password">
          </div>

          <div class="forgot-password">
            <a href="#">Forgot your password?</a>
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <!-- Demo Accounts -->
        <div class="demo-section">
          <p style="text-align: center; color: #666; margin: 20px 0 10px;">Comptes de démonstration</p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button (click)="loginDemo('admin')" class="demo-btn">
              👨‍💼 Admin
            </button>
            <button (click)="loginDemo('client')" class="demo-btn">
              🛍️ Client
            </button>
          </div>
        </div>

        <!-- Logout Button -->
        <div class="logout-section" *ngIf="isLoggedIn()">
          <button (click)="logout()" class="logout-btn">
            🚪 Se déconnecter
          </button>
        </div>

        <div class="social-login">
          <a href="#" class="social-btn">📱</a>
          <a href="#" class="social-btn">🌐</a>
          <a href="#" class="social-btn">📧</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :root {
      --primary-color: #b99dfa;
      --primary-gradient: linear-gradient(135deg, #b99dfa 0%, #9575cd 100%);
      --primary-hover: linear-gradient(135deg, #a485f7 0%, #7e57c2 100%);
    }

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
      border: none;
    }

    .login-card h2 {
      text-align: left;
      color: #333;
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: 600;
    }

    .subtitle {
      text-align: left;
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }

    .subtitle a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }

    .form-group {
      margin-bottom: 20px;
      position: relative;
    }

    .form-group label {
      display: none;
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

    .form-control::placeholder {
      color: #aaa;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      background: white;
      box-shadow: 0 0 0 3px rgba(185, 157, 250, 0.1);
    }

    .forgot-password {
      text-align: right;
      margin-bottom: 30px;
    }

    .forgot-password a {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
    }

    .btn-primary {
      width: 100%;
      padding: 15px;
      background: var(--primary-gradient);
      color: white;
      border: none;
      border-radius: 15px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 30px;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
      transform: translateY(-1px);
    }

    .logout-section {
      margin: 20px 0;
      text-align: center;
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
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: #c82333;
      transform: translateY(-1px);
    }

    .social-login {
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .social-btn {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 1px solid #e1e5e9;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: #666;
      font-size: 18px;
    }

    .social-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .alert {
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      text-align: center;
    }

    .alert-error {
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 10px;
      }

      .login-card {
        padding: 30px 25px;
        border-radius: 20px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isLoggedIn(): boolean {
    return this.authService.getCurrentUser() !== null;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      // Simulation de connexion
      setTimeout(() => {
        this.isLoading = false;
        // Créer un utilisateur factice
        const user = {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: email,
          role: 'CLIENT'
        };

        // Simuler le stockage de l'utilisateur
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', 'demo-token');

        // Redirection vers dashboard
        this.router.navigate(['/dashboard']);
      }, 1000);
    }
  }

  loginDemo(role: 'admin' | 'client') {
    const demoCredentials = {
      admin: { email: 'admin@logitrack.com', password: 'admin123' },
      client: { email: 'client@logitrack.com', password: 'client123' }
    };

    const credentials = demoCredentials[role];
    this.loginForm.patchValue(credentials);
    this.onLogin();
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    // Recharger la page pour mettre à jour l'état
    window.location.reload();
  }
}
