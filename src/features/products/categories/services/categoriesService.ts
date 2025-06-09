import api from '../../../../services/api';
import type { Category } from '../interfaces/CategoryInterface';
import type { CreateCategoryDTO } from '../dtos/create-category.dto';
import type { UpdateCategoryDTO } from '../dtos/update-category.dto';

export const categoriesService = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (categoryId: string) => api.get<Category>(`/categories/id/${categoryId}`),
  create: (createCategoryDTO: CreateCategoryDTO) =>
    api.post<Category>('/categories', createCategoryDTO),
  update: (categoryId: string, updateCategoryDTO: UpdateCategoryDTO) =>
    api.patch<Category>(`/categories/${categoryId}`, updateCategoryDTO),
  delete: (categoryId: string) => api.delete<void>(`/categories/${categoryId}`),
  deleteAll: () => api.delete<void>('/categories'),
};
