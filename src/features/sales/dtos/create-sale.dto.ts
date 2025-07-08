import type { Customer } from '../../customers/interfaces/CustomerInterface';
import type { CreateSaleProductDTO } from './create-sale-product.dto';

export interface CreateSaleDTO {
  cliente: string | Customer;
  productos: CreateSaleProductDTO[];
  pagoVenta: number;
  descuento?: number;
  metodoPago: 'efectivo' | 'credito' | 'tarjetaCreditoDebito' | 'puntos';
}
