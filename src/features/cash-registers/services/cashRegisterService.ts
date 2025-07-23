import api from '../../../services/api';
import type { CashRegister } from '../interfaces/CashRegisterInterface';
import type { CreateRegisterDTO } from '../dtos/create-register.dto';
import type { UpdateRegisterDTO } from '../dtos/update-register.dto';
import type { OpenRegisterDTO } from '../dtos/open-register.dto';
import type { CloseRegisterDTO } from '../dtos/close-register.dto';
import type { RegisterTransactionDTO } from '../dtos/register-transaction.dto';
import type { AssignRegisterToUserDTO } from '../dtos/assign-register-to-user.dto';

export const cashRegisterService = {
  getAll: () => api.get<CashRegister[]>('/cash-registers'),
  getById: (registerId: string) => api.get<CashRegister>(`/cash-registers/id/${registerId}`),
  getByCode: (codigo: string) => api.get<CashRegister>(`/cash-registers/code/${codigo}`),
  getByUser: (userId: string) => api.get<CashRegister[]>(`/cash-registers/user/${userId}`),
  getForCurrentUser: () => api.get<CashRegister[]>(`/cash-registers/current-user`),
  getOpen: () => api.get<CashRegister[]>('/cash-registers/open'),
  getOpenForCurrentUser: () => api.get<CashRegister>(`/cash-registers/open/current-user`),
  getClosed: () => api.get<CashRegister[]>('/cash-registers/close'),
  getAssignedForUser: (userId: string) =>
    api.get<CashRegister>(`/cash-registers/assigned/${userId}`),
  getAssignedForCurrentUser: () => api.get<CashRegister[]>(`/cash-registers/assigned/current-user`),
  create: (createRegisterDTO: CreateRegisterDTO) =>
    api.post<CashRegister>('/cash-registers', createRegisterDTO),
  update: (registerId: string, updateRegisterDTO: UpdateRegisterDTO) =>
    api.patch<CashRegister>(`/cash-registers/${registerId}`, updateRegisterDTO),
  assign: (registerId: string, assignRegisterToUserDTO: AssignRegisterToUserDTO) =>
    api.patch<CashRegister>(`/cash-registers/assign/${registerId}`, assignRegisterToUserDTO),
  open: (registerId: string, openRegisterDTO: OpenRegisterDTO) =>
    api.patch<CashRegister>(`/cash-registers/open/${registerId}`, openRegisterDTO),
  close: (registerId: string, closeRegisterDTO: CloseRegisterDTO) =>
    api.patch<CashRegister>(`/cash-registers/close/${registerId}`, closeRegisterDTO),
  registerTransaction: (registerId: string, registerTransactionDTO: RegisterTransactionDTO) =>
    api.post<CashRegister>(
      `/cash-registers/register-transaction/${registerId}`,
      registerTransactionDTO
    ),
  closeAll: () => api.post<void>(`/cash-registers/close`),
  delete: (cashRegisterId: string) => api.delete<void>(`/cash-registers/${cashRegisterId}`),
  deleteAll: () => api.delete<void>(`/cash-registers`),
};
