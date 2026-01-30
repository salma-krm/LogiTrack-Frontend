import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseService, Warehouse, WarehouseRequest } from '../../services/warehouse.service';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="warehouse-management">
      <div class="header">
        <h2>Gestion des Entrepôts</h2>
        <button
          class="btn-primary"
          (click)="openCreateModal()"
          [disabled]="loading">
          <i class="fas fa-plus"></i> Ajouter un entrepôt
        </button>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <span>Chargement...</span>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="alert alert-error">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
        <button (click)="error = ''" class="close-btn">×</button>
      </div>

      <!-- Success Message -->
      <div *ngIf="success" class="alert alert-success">
        <i class="fas fa-check-circle"></i>
        {{ success }}
        <button (click)="success = ''" class="close-btn">×</button>
      </div>

      <!-- Warehouses Table -->
      <div class="table-container" *ngIf="!loading">
        <table class="warehouses-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Statut</th>
              <th>Manager</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let warehouse of warehouses" [class.inactive]="!warehouse.active">
              <td>{{ warehouse.id }}</td>
              <td>
                <strong>{{ warehouse.name }}</strong>
              </td>
              <td>
                <span class="status" [class.active]="warehouse.active" [class.inactive]="!warehouse.active">
                  {{ warehouse.active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td>{{ warehouse.managerName || 'N/A' }}</td>
              <td>{{ warehouse.managerEmail || 'N/A' }}</td>
              <td class="actions">
                <button
                  class="btn-edit"
                  (click)="openEditModal(warehouse)"
                  title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn-delete"
                  (click)="confirmDelete(warehouse)"
                  title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="warehouses.length === 0" class="empty-state">
          <i class="fas fa-warehouse"></i>
          <h3>Aucun entrepôt trouvé</h3>
          <p>Commencez par créer votre premier entrepôt.</p>
          <button class="btn-primary" (click)="openCreateModal()">
            Créer un entrepôt
          </button>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Modifier' : 'Créer' }} un entrepôt</h3>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>

          <form [formGroup]="warehouseForm" (ngSubmit)="onSubmit()">
            <div class="modal-body">
              <div class="form-group">
                <label for="name">Nom de l'entrepôt *</label>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  placeholder="Entrez le nom de l'entrepôt"
                  [class.error]="warehouseForm.get('name')?.invalid && warehouseForm.get('name')?.touched">
                <div *ngIf="warehouseForm.get('name')?.invalid && warehouseForm.get('name')?.touched"
                     class="error-message">
                  Le nom de l'entrepôt est obligatoire
                </div>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    formControlName="active">
                  <span class="checkmark"></span>
                  Entrepôt actif
                </label>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn-secondary"
                (click)="closeModal()"
                [disabled]="submitting">
                Annuler
              </button>
              <button
                type="submit"
                class="btn-primary"
                [disabled]="warehouseForm.invalid || submitting">
                <span *ngIf="submitting" class="spinner-small"></span>
                {{ isEditMode ? 'Modifier' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="closeDeleteModal()">
        <div class="modal-content small" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirmer la suppression</h3>
            <button class="close-btn" (click)="closeDeleteModal()">×</button>
          </div>

          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer l'entrepôt <strong>{{ warehouseToDelete?.name }}</strong> ?</p>
            <p class="warning">Cette action est irréversible.</p>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn-secondary"
              (click)="closeDeleteModal()"
              [disabled]="submitting">
              Annuler
            </button>
            <button
              type="button"
              class="btn-danger"
              (click)="deleteWarehouse()"
              [disabled]="submitting">
              <span *ngIf="submitting" class="spinner-small"></span>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./warehouses.component.css']
})
export class WarehousesComponent implements OnInit {
  warehouses: Warehouse[] = [];
  warehouseForm: FormGroup;

  loading = false;
  submitting = false;
  error = '';
  success = '';

  showModal = false;
  showDeleteModal = false;
  isEditMode = false;
  currentWarehouseId: number | null = null;
  warehouseToDelete: Warehouse | null = null;

  constructor(
    private warehouseService: WarehouseService,
    private fb: FormBuilder
  ) {
    this.warehouseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      active: [true]
    });
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('👤 Current User:', currentUser);
    console.log('🔑 User Role:', currentUser.role);
    console.log('📦 Session Token:', localStorage.getItem('token'));
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.loading = true;
    this.error = '';

    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des entrepôts';
        this.loading = false;
        console.error('Error loading warehouses:', err);
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentWarehouseId = null;
    this.warehouseForm.reset({
      name: '',
      active: true
    });
    this.showModal = true;
  }

  openEditModal(warehouse: Warehouse) {
    this.isEditMode = true;
    this.currentWarehouseId = warehouse.id;
    this.warehouseForm.patchValue({
      name: warehouse.name,
      active: warehouse.active
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.warehouseForm.reset();
  }

  onSubmit() {
    if (this.warehouseForm.invalid) return;

    this.submitting = true;
    this.error = '';

    const warehouseData: WarehouseRequest = {
      name: this.warehouseForm.value.name,
      active: this.warehouseForm.value.active
    };

    const operation = this.isEditMode && this.currentWarehouseId
      ? this.warehouseService.updateWarehouse(this.currentWarehouseId, warehouseData)
      : this.warehouseService.createWarehouse(warehouseData);

    operation.subscribe({
      next: () => {
        this.success = `Entrepôt ${this.isEditMode ? 'modifié' : 'créé'} avec succès`;
        this.loadWarehouses();
        this.closeModal();
        this.submitting = false;
      },
      error: (err) => {
        this.error = `Erreur lors de la ${this.isEditMode ? 'modification' : 'création'} de l'entrepôt`;
        this.submitting = false;
        console.error('Error saving warehouse:', err);
      }
    });
  }

  confirmDelete(warehouse: Warehouse) {
    this.warehouseToDelete = warehouse;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.warehouseToDelete = null;
  }

  deleteWarehouse() {
    if (!this.warehouseToDelete) return;

    this.submitting = true;
    this.error = '';

    this.warehouseService.deleteWarehouse(this.warehouseToDelete.id).subscribe({
      next: () => {
        this.success = 'Entrepôt supprimé avec succès';
        this.loadWarehouses();
        this.closeDeleteModal();
        this.submitting = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la suppression de l\'entrepôt';
        this.submitting = false;
        console.error('Error deleting warehouse:', err);
      }
    });
  }
}
