import api from '../../../services/api';
import type { Payment } from '../interfaces/PaymentInterface';
import type { CreatePaymentDTO } from '../dtos/create-payment.dto';

export const paymentsService = {
  findAll: () => api.get<Payment[]>('/payments'),
  findById: (paymentId: string) => api.get<Payment>(`/payments/id/${paymentId}`),
  findBySale: (saleId: string) => api.get<Payment[]>(`/payments/sale/${saleId}`),
  findByCustomer: (customerId: string) => api.get<Payment[]>(`/payments/customer/${customerId}`),
  findByUser: (userId: string) => api.get<Payment[]>(`/payments/user/${userId}`),
  create: (createPaymentDTO: CreatePaymentDTO) => api.post<Payment>('/payments', createPaymentDTO),
  delete: (paymentId: string) => api.delete<void>(`/payments/${paymentId}`),
  deleteAll: () => api.delete<void>('/payments'),
};
