import api from '../../../../services/api';
import type { Transaction } from '../../interfaces/TransactionInterface';

export const transactionsService = {
  getAll: () => api.get<Transaction[]>(`/transactions`),
  getById: (transactionId: string) => api.get<Transaction>(`/transactions/id/${transactionId}`),
  getByCurrentUser: () => api.get<Transaction[]>(`/transactions/user/current-user`),
  getByUser: (userId: string) => api.get<Transaction[]>(`/transactions/user/${userId}`),
};
