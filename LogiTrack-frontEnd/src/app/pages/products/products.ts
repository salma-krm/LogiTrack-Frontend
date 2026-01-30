import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  totalProducts = 5;
  activeProducts = 4;
  inactiveProducts = 1;

  products = [
    {
      id: 1,
      sku: 'Ullamco aliqua Sit eillum ut deleniti quisquam ve',
      name: 'Amal Bryan',
      description: 'Magnam quis numquam',
      price: 434.00,
      categoryId: 1,
      categoryName: 'Salma',
      active: true
    },
    {
      id: 2,
      sku: 'Perferendis suscipit officia dolor voluptas sapien',
      name: 'Matthew Patrick',
      description: 'Ullamco nisi maxime',
      price: 913.00,
      categoryId: 1,
      categoryName: 'Salma',
      active: false
    },
    {
      id: 3,
      sku: 'Sed tempore excepturi eligendi et vel exercitatio',
      name: 'Miriam Mcmillan',
      description: 'Fuga Ad voluptatem',
      price: 103.00,
      categoryId: 1,
      categoryName: 'Salma',
      active: true
    },
    {
      id: 4,
      sku: 'Kaoutar-024',
      name: 'Écran 50 pouces Dell',
      description: 'pièce',
      price: 180.00,
      categoryId: 1,
      categoryName: 'Salma',
      active: true
    },
    {
      id: 5,
      sku: 'xxxxxx-024',
      name: 'Écrccccan 50 pouces Dell',
      description: 'pièce',
      price: 180.00,
      categoryId: 1,
      categoryName: 'Salma',
      active: true
    }
  ];

  filteredProducts = [...this.products];
  categories = [
    { id: 1, name: 'Salma' },
    { id: 2, name: 'Électronique' },
    { id: 3, name: 'Mobilier' }
  ];

  searchTerm = '';
  categoryFilter = '';

  showModal = false;
  isEditMode = false;
  currentProduct: any = this.getEmptyProduct();

  ngOnInit() {
    this.updateStatistics();
  }

  getEmptyProduct() {
    return {
      id: 0,
      sku: '',
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      categoryName: '',
      active: true
    };
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.categoryFilter ||
        product.categoryId.toString() === this.categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.filteredProducts = [...this.products];
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentProduct = this.getEmptyProduct();
    this.showModal = true;
  }

  openEditModal(product: any) {
    this.isEditMode = true;
    this.currentProduct = { ...product };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentProduct = this.getEmptyProduct();
  }

  saveProduct() {
    if (this.isEditMode) {
      const index = this.products.findIndex(p => p.id === this.currentProduct.id);
      if (index !== -1) {
        this.products[index] = { ...this.currentProduct };
      }
    } else {
      this.currentProduct.id = this.products.length + 1;
      this.products.push({ ...this.currentProduct });
    }
    this.applyFilters();
    this.updateStatistics();
    this.closeModal();
  }

  deleteProduct(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.products = this.products.filter(p => p.id !== id);
      this.applyFilters();
      this.updateStatistics();
    }
  }

  updateStatistics() {
    this.totalProducts = this.products.length;
    this.activeProducts = this.products.filter(p => p.active).length;
    this.inactiveProducts = this.products.filter(p => !p.active).length;
  }
}

