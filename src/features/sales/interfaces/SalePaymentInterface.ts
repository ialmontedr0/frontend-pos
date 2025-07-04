export interface SalePayment {
  _id: string;
  venta: string;
  cliente: string;
  usuario: string;
  metodoPago: string;
  montoPagado: number;
  referenciaExterna?: string;
  fecha: string;
}
