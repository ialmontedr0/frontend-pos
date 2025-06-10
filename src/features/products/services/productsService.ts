import api from '../../../services/api';
import type { CreateProductDTO } from '../dtos/create-product.dto';
import type { UpdateProductDTO } from '../dtos/update-product.dto';
import type { UpdateProductPriceBuyDTO } from '../dtos/update-product-price-buy.dto';
import type { UpdateProductPriceSaleDTO } from '../dtos/update-product-price-sale.dto';
import type { Product } from '../interfaces/ProductInterface';

export const productsService = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (productId: string) => api.get<Product>(`/products/id/${productId}`),
  getByCode: (codigo: string) => api.get<Product>(`/products/code/${codigo}`),
  create: (createProductDTO: CreateProductDTO) => api.post<Product>(`/products`, createProductDTO),
  update: (productId: string, updateProductDTO: UpdateProductDTO) =>
    api.patch<Product>(`/products/${productId}`, updateProductDTO),
  updatePriceBuy: (productId: string, updateProductPriceBuyDTO: UpdateProductPriceBuyDTO) =>
    api.patch<Product>(`/products/price/sale/${productId}`, updateProductPriceBuyDTO),
  updatePriceSale: (productId: string, updateProductPriceSaleDTO: UpdateProductPriceSaleDTO) =>
    api.patch<Product>(`/products/price/buy/${productId}`, updateProductPriceSaleDTO),
  delete: (productId: string) => api.delete<void>(`/products/${productId}`),
  deleteAll: () => api.delete<void>(`/products`),
};
