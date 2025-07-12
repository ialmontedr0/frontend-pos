import api from '../../../services/api';
import type { UpdateSettingsDTO } from '../dtos/update-settings.dto';
import type { Settings } from '../interfaces/SettingsInterface';

export const settingsService = {
  get: () => api.get<Settings>(`/settings`),
  update: (dto: UpdateSettingsDTO) => api.patch<Settings>(`/settings`, dto),
};
