export interface CreatePaymentDTO {
  venta: string;
  cliente?: string;
  metodoPago: string;
  montoPagado: number;
  referenciaExterna?: string;
}
