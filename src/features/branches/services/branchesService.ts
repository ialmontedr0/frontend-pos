import api from '../../../services/api';
import type { Branche } from '../interfaces/branche.interface';
import type { CreateBrancheDTO } from '../dtos/create-branche.dto';
import type { UpdateBrancheDTO } from '../dtos/update-branche.dto';

export const branchesService = {
  getAll: () => api.get<Branche[]>(`/branches`),
  getById: (brancheId: string) => api.get<Branche>(`/branches/id/${brancheId}`),
  create: (createBrancheDTO: CreateBrancheDTO) => api.post<Branche>(`/branches`, createBrancheDTO),
  update: (brancheId: string, updateBrancheDTO: UpdateBrancheDTO) =>
    api.patch<Branche>(`/branches/${brancheId}`, updateBrancheDTO),
  delete: (brancheId: string) => api.delete<void>(`/branches/${brancheId}`),
  deleteAll: () => api.delete<void>(`/branches`),
};
