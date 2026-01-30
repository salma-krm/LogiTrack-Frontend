import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🔐 Connexion</h1>
          <p>Connectez-vous à votre compte LogiTrack</p>
        </div>

        <!-- Messages d'erreur/succès -->
        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="Entrez votre email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error-text">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">L'email est obligatoire</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Format d'email invalide</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe *</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Entrez votre mot de passe"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-text">
              Le mot de passe est obligatoire
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe">
              <span class="checkmark"></span>
              Se souvenir de moi
            </label>
          </div>

          <button
            type="submit"
            class="login-btn"
            [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="login-footer">
          <p>Pas encore de compte ?
            <a routerLink="/auth/register" class="link">Créer un compte</a>
          </p>
          <a href="#" class="forgot-password">Mot de passe oublié ?</a>
        </div>

        <!-- Demo Accounts -->
        <div class="demo-accounts">
          <h3>Comptes de démonstration</h3>
          <div class="demo-buttons">
            <button (click)="loginDemo('admin')" class="demo-btn admin">
              👨‍💼 Admin
            </button>
            <button (click)="loginDemo('manager')" class="demo-btn manager">
              📦 Manager
            </button>
            <button (click)="loginDemo('client')" class="demo-btn client">
              🛍️ Client
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .login-header h1 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 28px;
      font-weight: 600;
    }

    .login-header p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .alert {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .alert-error {
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    .login-form {
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      color: #333;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input.error {
      border-color: #e74c3c;
    }

    .error-text {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 4px;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      color: #666;
    }

    .checkbox-label input {
      margin-right: 8px;
      width: auto;
    }

    .login-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
    }

    .login-footer {
      text-align: center;
    }

    .login-footer p {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
    }

    .demo-accounts {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .demo-accounts h3 {
      text-align: center;
      margin: 0 0 15px 0;
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .demo-buttons {
      display: flex;
      gap: 8px;
    }

    .demo-btn {
      flex: 1;
      padding: 8px;
      border: 1px solid #e1e5e9;
      border-radius: 6px;
      background: white;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .demo-btn:hover {
      background: #f8f9fa;
      transform: translateY(-1px);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 30px 20px;
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
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // Redirection basée sur le rôle
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erreur de connexion. Vérifiez vos identifiants.';
        }
      });
    }
  }

  loginDemo(role: 'admin' | 'manager' | 'client') {
    const demoCredentials = {
      admin: { email: 'admin@logitrack.com', password: 'admin123' },
      manager: { email: 'manager@logitrack.com', password: 'manager123' },
      client: { email: 'client@logitrack.com', password: 'client123' }
    };

    const credentials = demoCredentials[role];
    this.loginForm.patchValue(credentials);
    this.onLogin();
  }
}
