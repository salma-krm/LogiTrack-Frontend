import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesOrder {
  id?: number;
  warehouseId: number;
  notes?: string;
  orderLines: SalesOrderLine[];
  status?: string;
  createdAt?: Date;
}

export interface SalesOrderLine {
  productId: number;
  quantity: number;
  unitPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesOrderApiService {
  private readonly apiUrl = 'http://localhost:8082/api/sales-orders';

  constructor(private http: HttpClient) { }

  createOrder(order: SalesOrder): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(this.apiUrl, order);
  }

  createSalesOrder(order: SalesOrder): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(this.apiUrl, order);
  }

  getSalesOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl);
  }

  getSalesOrderById(id: number): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.apiUrl}/${id}`);
  }

  updateSalesOrder(id: number, order: SalesOrder): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.apiUrl}/${id}`, order);
  }

  deleteSalesOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
