import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>📝 Inscription</h1>
          <p>Créez votre compte LogiTrack</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom *</label>
              <input
                id="firstName"
                type="text"
                formControlName="firstName"
                placeholder="Votre prénom"
                [class.error]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
              <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="error-text">
                Le prénom est obligatoire
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Nom *</label>
              <input
                id="lastName"
                type="text"
                formControlName="lastName"
                placeholder="Votre nom"
                [class.error]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
              <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="error-text">
                Le nom est obligatoire
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="votre.email@exemple.com"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
            <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-text">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">L'email est obligatoire</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Format d'email invalide</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe *</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Mot de passe sécurisé"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-text">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Le mot de passe est obligatoire</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Minimum 8 caractères requis</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe *</label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              placeholder="Répétez votre mot de passe"
              [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
            <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" class="error-text">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">La confirmation est obligatoire</span>
              <span *ngIf="registerForm.errors?.['passwordMismatch']">Les mots de passe ne correspondent pas</span>
            </div>
          </div>

          <div class="form-group">
            <label for="role">Type de compte</label>
            <select id="role" formControlName="role" class="role-select">
              <option value="CLIENT">Client - Passer des commandes</option>
              <option value="WAREHOUSE_MANAGER">Manager - Gérer un entrepôt</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="acceptTerms" required>
              <span class="checkmark"></span>
              J'accepte les <a href="#" class="link">conditions d'utilisation</a> et la <a href="#" class="link">politique de confidentialité</a>
            </label>
            <div *ngIf="registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched" class="error-text">
              Vous devez accepter les conditions
            </div>
          </div>

          <button
            type="submit"
            class="register-btn"
            [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>

        <div class="register-footer">
          <p>Déjà un compte ?
            <a routerLink="/auth/login" class="link">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .register-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .register-header h1 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 28px;
      font-weight: 600;
    }

    .register-header p {
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

    .alert-success {
      background-color: #efe;
      color: #3c3;
      border: 1px solid #cfc;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      color: #333;
      font-weight: 500;
      font-size: 14px;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group select:focus {
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

    .role-select {
      background: white;
      cursor: pointer;
    }

    .checkbox-group {
      margin-bottom: 25px;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
      font-size: 13px;
      color: #666;
      line-height: 1.4;
    }

    .checkbox-label input {
      margin: 0 8px 0 0;
      width: auto;
      min-width: 16px;
    }

    .link {
      color: #667eea;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    .register-btn {
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

    .register-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .register-btn:disabled {
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

    .register-footer {
      text-align: center;
      margin-top: 20px;
    }

    .register-footer p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 580px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .register-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['CLIENT'],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role
      };

      // Simuler l'inscription (remplacer par un appel API réel)
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Compte créé avec succès ! Redirection vers la connexion...';

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      }, 1500);
    }
  }
}
