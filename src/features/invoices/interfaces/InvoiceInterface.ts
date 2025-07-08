import type { InvoiceType } from '../types/invoice-type';

export interface Invoice {
  _id: string;
  codigo: string;
  tipo: InvoiceType;
  venta?: { _id: string; codigo: string };
  pago?: { _id: string; venta: string };
  createdAt: string;
  generatedBy?: { _id: string; usuario: string };
  downloatedBy?: { _id: string; usuario: string };
}
