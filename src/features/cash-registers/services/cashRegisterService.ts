import api from '../../../services/api';
import type { CashRegister } from '../interfaces/CashRegisterInterface';
import type { CreateRegisterDTO } from '../dtos/create-register.dto';
import type { UpdateRegisterDTO } from '../dtos/update-register.dto';
import type { OpenRegisterDTO } from '../dtos/open-register.dto';
import type { CloseRegisterDTO } from '../dtos/close-register.dto';
import type { RegisterTransactionDTO } from '../dtos/register-transaction.dto';

export const cashRegisterService = {
  getAll: () => api.get<CashRegister[]>('/cash-registers'),
  getById: (cashRegisterId: string) =>
    api.get<CashRegister>(`/cash-registers/id/${cashRegisterId}`),
  getByCode: (codigo: string) => api.get<CashRegister>(`/cash-registers/code/${codigo}`),
  getByUser: (userId: string) => api.get<CashRegister[]>(`/cash-registers/user/${userId}`),
  getAllForCurrentUser: () => api.get<CashRegister[]>(`/cash-registers/current-user`),
  getOpenForCurrentUser: () => api.get<CashRegister>(`/cash-registers/current-user/open`),
  getAssignedCashRegisterToUser: () =>
    api.get<CashRegister[]>(`/cash-registers/assigned/current-user`),
  create: (createRegisterDTO: CreateRegisterDTO) =>
    api.post<CashRegister>('/cash-registers', createRegisterDTO),
  assignToUser: (userId: string, codigo: string) =>
    api.patch<CashRegister>(`/cash-registers/assign/${userId}/${codigo}`),
  update: (cashRegisterId: string, updateRegisterDTO: UpdateRegisterDTO) =>
    api.patch<CashRegister>(`/cash-registers/${cashRegisterId}`, updateRegisterDTO),
  open: (cashRegisterId: string, openRegisterDTO: OpenRegisterDTO) =>
    api.patch<CashRegister>(`/cash-registers/open/${cashRegisterId}`, openRegisterDTO),
  close: (cashRegisterId: string, closeRegisterDTO: CloseRegisterDTO) =>
    api.patch<CashRegister>(`/cash-registers/close/${cashRegisterId}`, closeRegisterDTO),
  registerTransaction: (cashRegisterId: string, registerTransactionDTO: RegisterTransactionDTO) =>
    api.post<CashRegister>(
      `/cash-registers/register-transaction/${cashRegisterId}`,
      registerTransactionDTO
    ),
  closeAll: () => api.post<void>(`/cash-registers/close`),
  delete: (cashRegisterId: string) => api.delete<void>(`/cash-registers/${cashRegisterId}`),
  deleteAll: () => api.delete<void>(`/cash-registers`),
};
