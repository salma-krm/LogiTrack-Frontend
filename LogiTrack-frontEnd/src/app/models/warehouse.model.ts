export interface WarehouseRequest {
  name: string;
  active?: boolean;
}

export interface WarehouseResponse {
  id: number;
  name: string;
  active: boolean;
  managerId: number;
  managerName: string;
  managerEmail: string;
}

export interface Warehouse {
  id?: number;
  name: string;
  active: boolean;
  managerId?: number;
  managerName?: string;
  managerEmail?: string;
}
