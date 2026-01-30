import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface SalesOrderRequest {
  warehouseId: number;
  notes?: string;
  orderLines: SalesOrderLineRequest[];
}

export interface SalesOrderLineRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface SalesOrderResponse {
  id: number;
  orderNumber: string;
  warehouseId: number;
  notes?: string;
  status: string;
  createdAt: Date;
  orderLines: SalesOrderLineRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private readonly apiUrl = 'http://localhost:8082/api/sales-orders';

  constructor(private http: HttpClient) { }

  createOrder(orderRequest: SalesOrderRequest): Observable<SalesOrderResponse> {
    // Pour les tests, simulons une réponse
    const mockResponse: SalesOrderResponse = {
      id: Math.floor(Math.random() * 1000) + 1,
      orderNumber: `CMD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      warehouseId: orderRequest.warehouseId,
      notes: orderRequest.notes,
      status: 'PENDING',
      createdAt: new Date(),
      orderLines: orderRequest.orderLines
    };

    return of(mockResponse);
  }

  getOrders(): Observable<SalesOrderResponse[]> {
    return this.http.get<SalesOrderResponse[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<SalesOrderResponse> {
    return this.http.get<SalesOrderResponse>(`${this.apiUrl}/${id}`);
  }

  updateOrder(id: number, order: SalesOrderRequest): Observable<SalesOrderResponse> {
    return this.http.put<SalesOrderResponse>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
