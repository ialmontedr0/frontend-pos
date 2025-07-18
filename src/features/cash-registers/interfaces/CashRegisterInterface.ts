import type { Transaction } from './TransactionInterface';

export interface CashRegister {
  _id: string;
  codigo: string;
  montoApertura: number;
  montoCierre: number;
  diferencia?: number;
  estado: 'abierta' | 'cerrada';
  transacciones: Transaction[];
  montoActual: number;
  createdBy: { _id: string; usuario: string };
  updatedBy?: { _id: string; usuario: string };
  assignedTo?: { _id: string; usuario: string };
  openBy?: { _id: string; usuario: string };
  closedBy?: { _id: string; usuario: string };
  openAt?: string;
  closedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
