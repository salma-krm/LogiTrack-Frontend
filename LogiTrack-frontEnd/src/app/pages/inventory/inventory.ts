import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
})
export class InventoryComponent implements OnInit {
  // Statistics
  totalInventories = 1;
  lowStock = 0;
  outOfStock = 0;

  // Inventory data
  inventories = [
    {
      id: 1,
      productId: 1,
      productName: 'Écran 50 pouces Dell',
      warehouseId: 1,
      warehouseName: 'Entrepôt Test',
      quantityInStock: 63,
      reservedQuantity: 0,
      availableQuantity: 63
    }
  ];

  filteredInventories = [...this.inventories];

  products = [
    { id: 1, name: 'Écran 50 pouces Dell' },
    { id: 2, name: 'Clavier Mécanique' },
    { id: 3, name: 'Souris Gaming' }
  ];

  warehouses = [
    { id: 1, name: 'Entrepôt Test' },
    { id: 2, name: 'Entrepôt Principal' },
    { id: 3, name: 'Entrepôt Secondaire' }
  ];

  // Filters
  searchTerm = '';
  warehouseFilter = '';
  productFilter = '';

  // Modal
  showModal = false;
  isEditMode = false;
  currentInventory: any = this.getEmptyInventory();

  ngOnInit() {
    this.updateStatistics();
  }

  getEmptyInventory() {
    return {
      id: 0,
      productId: '',
      productName: '',
      warehouseId: '',
      warehouseName: '',
      quantityInStock: 0,
      reservedQuantity: 0,
      availableQuantity: 0
    };
  }

  applyFilters() {
    this.filteredInventories = this.inventories.filter(inventory => {
      const matchesSearch = !this.searchTerm ||
        inventory.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inventory.warehouseName.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesWarehouse = !this.warehouseFilter ||
        inventory.warehouseId.toString() === this.warehouseFilter;

      const matchesProduct = !this.productFilter ||
        inventory.productId.toString() === this.productFilter;

      return matchesSearch && matchesWarehouse && matchesProduct;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.warehouseFilter = '';
    this.productFilter = '';
    this.filteredInventories = [...this.inventories];
  }

  getStatusClass(inventory: any): string {
    if (inventory.availableQuantity === 0) {
      return 'badge-danger';
    } else if (inventory.availableQuantity < 10) {
      return 'badge-warning';
    }
    return 'badge-success';
  }

  getStatusLabel(inventory: any): string {
    if (inventory.availableQuantity === 0) {
      return 'RUPTURE';
    } else if (inventory.availableQuantity < 10) {
      return 'STOCK FAIBLE';
    }
    return 'DISPONIBLE';
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentInventory = this.getEmptyInventory();
    this.showModal = true;
  }

  openEditModal(inventory: any) {
    this.isEditMode = true;
    this.currentInventory = { ...inventory };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentInventory = this.getEmptyInventory();
  }

  saveInventory() {
    // Calculate available quantity
    this.currentInventory.availableQuantity =
      this.currentInventory.quantityInStock - this.currentInventory.reservedQuantity;

    // Get product and warehouse names
    const product = this.products.find(p => p.id.toString() === this.currentInventory.productId.toString());
    const warehouse = this.warehouses.find(w => w.id.toString() === this.currentInventory.warehouseId.toString());

    if (product) this.currentInventory.productName = product.name;
    if (warehouse) this.currentInventory.warehouseName = warehouse.name;

    if (this.isEditMode) {
      const index = this.inventories.findIndex(i => i.id === this.currentInventory.id);
      if (index !== -1) {
        this.inventories[index] = { ...this.currentInventory };
      }
    } else {
      this.currentInventory.id = this.inventories.length + 1;
      this.inventories.push({ ...this.currentInventory });
    }

    this.applyFilters();
    this.updateStatistics();
    this.closeModal();
  }

  deleteInventory(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet inventaire ?')) {
      this.inventories = this.inventories.filter(i => i.id !== id);
      this.applyFilters();
      this.updateStatistics();
    }
  }

  updateStatistics() {
    this.totalInventories = this.inventories.length;
    this.lowStock = this.inventories.filter(i => i.availableQuantity > 0 && i.availableQuantity < 10).length;
    this.outOfStock = this.inventories.filter(i => i.availableQuantity === 0).length;
  }
}
