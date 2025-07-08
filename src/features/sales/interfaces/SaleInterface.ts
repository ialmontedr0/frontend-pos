import type { Payment } from '../../payments/interfaces/PaymentInterface';
import type { SaleProduct } from './SaleProductInterface';

export interface Sale {
  _id: string;
  codigo: string;
  usuario: { _id: string; usuario: string };
  cliente: { _id: string; nombre: string };
  caja: { _id: string; codigo: string };
  fecha: string;
  productos: SaleProduct[];
  itbisVenta: number;
  montoPendiente: number;
  estado: string;
  metodoPago: string;
  subtotalVenta: number;
  pagoVenta: number;
  descuento: number;
  pagos: Payment[];
  totalVenta: number;
  createdBy: string;
  createdAt: string;
}
