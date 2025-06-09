import api from '../../../services/api';
import type { CreateCustomerDTO } from '../dtos/create-customer.dto';
import type { UpdateCustomerDTO } from '../dtos/update-customer.dto';
import type { Customer } from '../interfaces/CustomerInterface';

export const customersService = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (customerId: string) => api.get<Customer>(`/customers/id/${customerId}`),
  create: (createCustomerDTO: CreateCustomerDTO) =>
    api.post<Customer>('/customers', createCustomerDTO),
  update: (customerId: string, updateCustomerDTO: UpdateCustomerDTO) =>
    api.patch<Customer>(`/customers/${customerId}`, updateCustomerDTO),
  delete: (customerId: string) => api.delete<void>(`/customers/${customerId}`),
  deleteAll: () => api.delete<void>('/customers'),
};
