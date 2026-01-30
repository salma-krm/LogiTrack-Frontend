import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface InventoryMovement {
  id?: number;
  type?: string;
  quantity?: number;
  date?: string;
}

export interface Inventory {
  id?: number;
  productId: number | null;
  productName?: string;
  warehouseId: number | null;
  warehouseName?: string;
  quantityOnHand: number;
  quantityReserved: number;
  movements?: InventoryMovement[];
}

export interface InventoryRequest {
  productId: number;
  warehouseId: number;
  quantityOnHand: number;
  quantityReserved: number;
}

export interface InventoryResponse {
  id: number;
  productId: number;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  quantityOnHand: number;
  quantityReserved: number;
  movements?: InventoryMovement[];
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:8082/api/inventories';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getHttpOptions() {
    const token = this.isBrowser ? localStorage.getItem('token') : null;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.error('InventoryService - Erreur API:', error);

    if (error.status === 0) {
      return throwError(() => new Error('Impossible de se connecter au serveur backend.'));
    }

    if (error.status === 401) {
      return throwError(() => new Error('Non autorisé. Veuillez vous reconnecter.'));
    }

    if (error.status === 404) {
      return throwError(() => new Error('Inventaire non trouvé.'));
    }

    return throwError(() => new Error(error.error?.message || 'Une erreur est survenue.'));
  }

  getAllInventories(): Observable<InventoryResponse[]> {
    console.log('InventoryService - Chargement des inventaires depuis:', this.apiUrl);
    return this.http.get<InventoryResponse[]>(this.apiUrl, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getInventoryById(id: number): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(`${this.apiUrl}/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  createInventory(inventory: Inventory): Observable<InventoryResponse> {
    if (!inventory.productId || !inventory.warehouseId) {
      throw new Error('Le produit et l\'entrepôt sont obligatoires');
    }

    const inventoryRequest: InventoryRequest = {
      productId: inventory.productId,
      warehouseId: inventory.warehouseId,
      quantityOnHand: inventory.quantityOnHand || 0,
      quantityReserved: inventory.quantityReserved || 0
    };

    console.log('InventoryService - Création inventaire:', inventoryRequest);
    return this.http.post<InventoryResponse>(this.apiUrl, inventoryRequest, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  updateInventory(id: number, inventory: Inventory): Observable<InventoryResponse> {
    if (!inventory.productId || !inventory.warehouseId) {
      throw new Error('Le produit et l\'entrepôt sont obligatoires');
    }

    const inventoryRequest: InventoryRequest = {
      productId: inventory.productId,
      warehouseId: inventory.warehouseId,
      quantityOnHand: inventory.quantityOnHand || 0,
      quantityReserved: inventory.quantityReserved || 0
    };

    console.log('InventoryService - Mise à jour inventaire:', id, inventoryRequest);
    return this.http.put<InventoryResponse>(`${this.apiUrl}/${id}`, inventoryRequest, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  deleteInventory(id: number): Observable<void> {
    console.log('InventoryService - Suppression inventaire:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getAvailableQuantity(inventory: Inventory | InventoryResponse): number {
    return (inventory.quantityOnHand || 0) - (inventory.quantityReserved || 0);
  }
}
