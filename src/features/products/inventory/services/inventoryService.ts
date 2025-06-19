import api from '../../../../services/api';
import type { Product } from '../../interfaces/ProductInterface';
import type { IncreaseProductStockDTO } from '../dtos/increate-product-stock.dto';
import type { DecreaseProductStockDTO } from '../dtos/decrease-product-stock.dto';
import type { UpdateProductStockDTO } from '../dtos/update-product-stock.dto';

export const inventoryService = {
  getLowStock: () => api.get<Product[]>('/inventory/low-stock'),
  getRecent: () => api.get<Product[]>('/inventory/recent'),
  getTopSold: () => api.get<Product[]>('/inventory/top-sold'),
  getLeastSold: () => api.get<Product[]>('/inventory/least-sold'),
  updateStock: (productId: string, updateProductStockDTO: UpdateProductStockDTO) =>
    api.patch<Product>(`/inventory/stock/update/${productId}`, updateProductStockDTO),
  increaseStock: (productId: string, increaseProductStockDTO: IncreaseProductStockDTO) =>
    api.patch<Product>(`/inventory/stock/increase/${productId}`, increaseProductStockDTO),
  decreaseStock: (productId: string, decreaseProductStockDTO: DecreaseProductStockDTO) =>
    api.patch<Product>(`/inventory/stocl/decrease/${productId}`, decreaseProductStockDTO),
};
