import type { SalePayment } from '../../sales/interfaces/SalePaymentInterface';
import type { SaleProduct } from '../../sales/interfaces/SaleProductInterface';

export interface CustomerPurchase {
  readonly _id: string;
  codigo: string;
  usuario: { _id: string, usuario: string };
  fecha: Date;
  productos: SaleProduct[];
  itbisCompra: number;
  estado: 'completada' | 'pendiente';
  metodoPago: 'efectivo' | 'credito' | 'tarjetaCreditoDebito' | 'puntos';
  subtotal: number;
  pago: number;
  pagos: SalePayment[];
  caja: { _id: string; codigo: string };
  total: number;
}
