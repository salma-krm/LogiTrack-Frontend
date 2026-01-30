import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  form = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactInfo: '' // Ajouter ce champ optionnel
  };

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    // Validation des mots de passe
    if (this.form.password !== this.form.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Validation des champs obligatoires
    if (!this.form.firstName.trim() || !this.form.lastName.trim() ||
        !this.form.email.trim() || !this.form.password.trim()) {
      alert('Tous les champs obligatoires doivent être remplis');
      return;
    }

    // Format exact attendu par RegisterRequest Spring Boot
    const registerData = {
      firstName: this.form.firstName.trim(),
      lastName: this.form.lastName.trim(),
      email: this.form.email.trim(),
      password: this.form.password,
      role: "CLIENT", // Correspond à Role.CLIENT dans votre enum
      contactInfo: this.form.contactInfo.trim() || null
    };

    console.log('Sending registration data:', registerData);

    this.auth.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('Compte créé avec succès !');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Register failed:', err);
        console.error('Error details:', err.error);

        if (err.status === 500) {
          alert('Erreur serveur. Vérifiez que le backend Spring Boot est démarré sur le port 8082');
        } else if (err.status === 400) {
          const message = err.error?.message || 'Données invalides';
          alert('Erreur de validation: ' + message);
        } else if (err.status === 409) {
          alert('Cet email est déjà utilisé');
        } else {
          alert('Erreur lors de la création du compte: ' + (err.error?.message || 'Erreur inconnue'));
        }
      }
    });
  }
}
