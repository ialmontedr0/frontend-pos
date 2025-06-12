import type { SaleProduct } from './SaleProductInterface';

export interface Sale {
  _id: string;
  codigo: string;
  usuario: string;
  cliente: string;
  fecha: string;
  productos: SaleProduct[];
  itbisVenta: number;
  montoPendiente: number;
  estado: string;
  metodoPago: string;
  subtotalVenta: number;
  pagoVenta: number;
  totalVenta: number;
  createdBy: string;
  createdAt: string;
}
