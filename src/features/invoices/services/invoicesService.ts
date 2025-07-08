import api from '../../../services/api';
import type { Invoice } from '../interfaces/InvoiceInterface';
import type { GenerateInvoiceDto } from '../dtos/generate-invoice.dto';

export const invoicesService = {
  getAllInvoices: () => api.get<Invoice[]>(`/invoices`),
  getAllForCurrentUser: () => api.get<Invoice[]>(`/invoices/current-user`),
  getById: (invoiceId: string) => api.get<Invoice>(`/invoices/id/${invoiceId}`),
  getByCode: (codigo: string) => api.get<Invoice>(`/invoices/code/${codigo}`),
  getBySale: (saleId: string) => api.get<Invoice[]>(`/invoices/sale/${saleId}`),
  getByUser: (userId: string) => api.get<Invoice[]>(`/invoices/user/${userId}`),
  getByCustomer: (customerId: string) => api.get<Invoice[]>(`/invoices/customer/${customerId}`),
  generate: (generateInvoiceDto: GenerateInvoiceDto) =>
    api.post<Invoice>(`/invoices/generate/`, generateInvoiceDto),
  download: (invoiceId: string) =>
    api.get<Blob>(`/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    }),
  delete: (invoiceId: string) => api.delete<void>(`/invoices/${invoiceId}`),
  deleteAll: () => api.delete<void>(`/invoices`),
};
