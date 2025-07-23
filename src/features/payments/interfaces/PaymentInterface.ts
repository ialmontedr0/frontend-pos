
export interface Payment {
  _id: string;
  codigo: string;
  venta: { _id: string; codigo: string };
  cliente: { _id: string; nombre: string };
  usuario: { _id: string; usuario: string };
  metodoPago: 'efectivo' | 'tarjetaCreditoDebito' | 'puntos';
  montoPagado: number;
  referenciaExterna?: string;
  fecha: string;
}
