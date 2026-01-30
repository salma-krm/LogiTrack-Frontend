import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Warehouse {
  id: number;
  name: string;
  active: boolean;
  capacity?: number;
  currentOccupancy?: number;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  managerId?: number | null;
  managerName?: string | null;
  managerEmail?: string | null;
}

export interface WarehouseRequest {
  name: string;
  active: boolean;
  capacity?: number;
  managerId?: number;
}

export interface WarehouseResponse {
  id: number;
  name: string;
  active: boolean;
  capacity?: number;
  currentOccupancy?: number;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  managerId?: number | null;
  managerName?: string | null;
  managerEmail?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private readonly apiUrl = 'http://localhost:8082/api/warehouses';

  constructor(private http: HttpClient) { }

  getAllWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl);
  }

  getWarehouseById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/${id}`);
  }

  createWarehouse(warehouse: WarehouseRequest): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, warehouse);
  }

  updateWarehouse(id: number, warehouse: WarehouseRequest): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/${id}`, warehouse);
  }

  deleteWarehouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
