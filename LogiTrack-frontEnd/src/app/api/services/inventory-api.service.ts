import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Inventory {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
}

export interface InventoryMovement {
  id: number;
  productId: number;
  warehouseId: number;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  referenceNumber?: string;
  createdAt: string;
  createdBy: string;
}

export interface StockAdjustmentRequest {
  productId: number;
  warehouseId: number;
  newQuantity: number;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {
  private readonly API_URL = 'http://localhost:8082/api/inventory';

  constructor(private http: HttpClient) {}

  getInventory(filters?: {
    warehouseId?: number;
    productId?: number;
    lowStock?: boolean;
    page?: number;
    size?: number;
  }): Observable<any> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get(this.API_URL, { params });
  }

  getInventoryByWarehouse(warehouseId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.API_URL}/warehouse/${warehouseId}`);
  }

  getInventoryMovements(filters?: {
    productId?: number;
    warehouseId?: number;
    movementType?: string;
    fromDate?: string;
    toDate?: string;
  }): Observable<InventoryMovement[]> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<InventoryMovement[]>(`${this.API_URL}/movements`, { params });
  }

  adjustStock(adjustment: StockAdjustmentRequest): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.API_URL}/adjust`, adjustment);
  }

  transferStock(transfer: {
    productId: number;
    fromWarehouseId: number;
    toWarehouseId: number;
    quantity: number;
    reason: string;
  }): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/transfer`, transfer);
  }

  getLowStockAlerts(warehouseId?: number): Observable<Inventory[]> {
    const params = warehouseId ? new HttpParams().set('warehouseId', warehouseId.toString()) : undefined;
    return this.http.get<Inventory[]>(`${this.API_URL}/low-stock`, { params });
  }
}
