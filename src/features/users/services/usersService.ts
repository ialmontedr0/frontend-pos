import api from '../../../services/api';
import type { ChangeUserPasswordDTO } from '../dtos/change-user-password.dto';
import type { CreateUserDTO } from '../dtos/create-user.dto';
import type { UpdateUserDTO } from '../dtos/update-user.dto';
import type { User } from '../interfaces/UserInterface';

export const usersService = {
  getAll: () => api.get<User[]>('/users'),
  getById: (userId: string) => api.get<User>(`/users/id/${userId}`),
  getByUsername: (usuario: string) => api.get<User>(`/users/user/${usuario}`),
  getByRole: (rol: string) => api.get<User[]>(`/users/filter/role/${rol}`),
  getByStatus: (estado: string) => api.get<User[]>(`/users/filter/status/${estado}`),
  create: (createUserDTO: CreateUserDTO) => api.post<User>('/users', createUserDTO),
  update: (userId: string, updateUserDTO: UpdateUserDTO) =>
    api.patch<User>(`/users/${userId}`, updateUserDTO),
  changePassword: (changeUserPasswordDTO: ChangeUserPasswordDTO) =>
    api.post<void>(`/profile/change-password`, changeUserPasswordDTO),
  activate: (userId: string) => api.patch<void>(`/users/activate/${userId}`),
  deactivate: (userId: string) => api.patch<void>(`/users/deactivate/${userId}`),
  delete: (userId: string) => api.delete<void>(`/users/${userId}`),
  deleteAll: () => api.delete<void>(`/users`),
  resetPreferences: (userId: string) => api.patch<User>(`/users/reset-preferences/${userId}`),
  updateSettings: (configuracion: Partial<User['configuracion']>) =>
    api.patch<User>(`/settings/update`, configuracion),
  setTheme: (tema: 'claro' | 'oscuro' | 'sistema') =>
    api.patch<any>('/settings/set-theme', { tema }),
  toggleTheme: (tema: 'claro' | 'oscuro' | 'sistema') =>
    api.patch<any>('/settings/toggle-theme', { tema }),
  resetSettings: () => api.patch<User>(`/settings/reset`),
};
