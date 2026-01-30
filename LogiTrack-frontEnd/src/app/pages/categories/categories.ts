import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isModalOpen = false;
  isEditMode = false;
  currentCategory: Category = { name: '' };
  error = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    console.log('CategoriesComponent - Initialisation');
    this.loadCategories();
  }

  loadCategories() {
    console.log('CategoriesComponent - Chargement des catégories');
    this.error = '';

    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        console.log('CategoriesComponent - Catégories reçues:', data);
        this.categories = data;
      },
      error: (err) => {
        console.error('CategoriesComponent - Erreur:', err);
        this.error = err.message || 'Erreur lors du chargement des catégories';

        // Si c'est une erreur de connexion, afficher un message spécifique
        if (err.message?.includes('se connecter au serveur')) {
          this.error = 'Impossible de se connecter au serveur. Vérifiez que votre backend Spring Boot est démarré sur le port 8082.';
        }
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentCategory = { name: '' };
    this.isModalOpen = true;
    this.error = '';
  }

  openEditModal(category: Category) {
    this.isEditMode = true;
    this.currentCategory = { ...category };
    this.isModalOpen = true;
    this.error = '';
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentCategory = { name: '' };
    this.error = '';
  }

  saveCategory() {
    console.log('CategoriesComponent - saveCategory appelé');
    console.log('CategoriesComponent - currentCategory:', this.currentCategory);
    
    if (!this.currentCategory.name.trim()) {
      this.error = 'Le nom de la catégorie est obligatoire';
      return;
    }

    this.error = '';

    if (this.isEditMode && this.currentCategory.id) {
      console.log('CategoriesComponent - Mode édition');
      this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe({
        next: () => {
          console.log('CategoriesComponent - Mise à jour réussie');
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error('CategoriesComponent - Erreur mise à jour:', err);
          this.error = err.message || 'Erreur lors de la mise à jour';
        }
      });
    } else {
      console.log('CategoriesComponent - Mode création');
      this.categoryService.createCategory(this.currentCategory).subscribe({
        next: (response) => {
          console.log('CategoriesComponent - Création réussie:', response);
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error('CategoriesComponent - Erreur création:', err);
          this.error = err.message || 'Erreur lors de la création';
        }
      });
    }
  }

  deleteCategory(category: Category) {
    if (!category.id) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          this.error = err.message || 'Erreur lors de la suppression';
        }
      });
    }
  }
}
