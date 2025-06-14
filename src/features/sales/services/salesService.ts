import api from "../../../services/api";
import type { Sale } from "../interfaces/SaleInterface";
import type { CreateSaleDTO } from "../dtos/create-sale.dto";

export const salesService = {
    getAll: () => api.get<Sale[]>('/sales'),
    getById: (saleId: string) => api.get<Sale>(`/sales/id/${saleId}`),
    getByCode: (codigo: string) => api.get<Sale>(`/sales/code/${codigo}`),
    getByUser: (userId: string) => api.get<Sale[]>(`/sales/user/${userId}`),
    getByCustomer: (customerId: string) => api.get<Sale[]>(`/sales/customer/${customerId}`),
    create: (createSaleDTO: CreateSaleDTO) => api.post<Sale>(`/sales`, createSaleDTO),
    delete: (saleId: string) => api.delete<void>(`/sales/${saleId}`),
    deleteAll: () =>api.delete<void>('/sales')
}