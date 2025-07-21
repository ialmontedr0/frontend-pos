import api from '../../../services/api';
import type { Store } from '../interfaces/store.interface';
import type { CreateStoreDTO } from '../dtos/create-store.dto';
import type { UpdateStoreDTO } from '../dtos/update-store.dto';

export const storesService = {
  getAll: () => api.get<Store[]>(`/stores`),
  getById: (brancheId: string) => api.get<Store>(`/stores/id/${brancheId}`),
  getByCode: (codigo: string) => api.get<Store>(`/stores/code/${codigo}`),
  create: (createBrancheDTO: CreateStoreDTO) => api.post<Store>(`/stores`, createBrancheDTO),
  update: (brancheId: string, updateBrancheDTO: UpdateStoreDTO) =>
    api.patch<Store>(`/stores/${brancheId}`, updateBrancheDTO),
  delete: (brancheId: string) => api.delete<void>(`/stores/${brancheId}`),
  deleteAll: () => api.delete<void>(`/stores`),
};
