import type { Sale } from '../../sales/interfaces/SaleInterface';

export interface Payment {
  _id: string;
  venta: string | Sale;
  cliente: string;
  usuario: string;
  metodoPago: 'efectivo' | 'credito' | 'tarjetaCreditoDebito' | 'puntos';
  montoPagado: number;
  referenciaExterna?: string;
  fecha: string;
}
