import api from '../../../../services/api';
import type { Provider } from '../interfaces/ProviderInterface';
import type { CreateProviderDTO } from '../dtos/create-provider.dto';
import type { UpdateProviderDTO } from '../dtos/update-provider.dto';

export const providersService = {
  getAll: () => api.get<Provider[]>('/providers'),
  getById: (providerId: string) => api.get<Provider>(`/providers/id/${providerId}`),
  getByRNC: (RNC: string) => api.get<Provider>(`/providers/rnc/${RNC}`),
  create: (createProviderDTO: CreateProviderDTO) =>
    api.post<Provider>('/providers', createProviderDTO),
  update: (providerId: string, updateProviderDTO: UpdateProviderDTO) =>
    api.patch<Provider>(`/providers/${providerId}`, updateProviderDTO),
  delete: (providerId: string) => api.delete<void>(`/providers/${providerId}`),
  deleteAll: () => api.delete<void>('/providers'),
};
