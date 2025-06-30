import type { Product } from '../../../products/interfaces/ProductInterface';

export interface SaleItem {
  producto: Product;
  cantidad: number;
}
