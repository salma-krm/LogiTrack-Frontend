import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  originalPrice: number;
  profit: number;
  active: boolean;
  categoryId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:8082/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    // Pour les tests, retournons des données mockées
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Ordinateur Portable',
        description: 'Ordinateur portable haute performance',
        sku: 'LAPTOP001',
        price: 899.99,
        originalPrice: 750.00,
        profit: 149.99,
        active: true,
        categoryId: 1
      },
      {
        id: 2,
        name: 'Souris Sans Fil',
        description: 'Souris ergonomique sans fil',
        sku: 'MOUSE001',
        price: 29.99,
        originalPrice: 20.00,
        profit: 9.99,
        active: true,
        categoryId: 2
      },
      {
        id: 3,
        name: 'Clavier Mécanique',
        description: 'Clavier mécanique RGB',
        sku: 'KEYB001',
        price: 129.99,
        originalPrice: 90.00,
        profit: 39.99,
        active: true,
        categoryId: 2
      }
    ];

    return of(mockProducts);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
