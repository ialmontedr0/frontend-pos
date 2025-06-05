import api from '../../../../services/api';
import type { User } from '../../interfaces/UserInterface';
import type { ChangeUserPasswordDTO } from '../../dtos/change-user-password.dto';
import type { UpdateProfileDTO } from '../dtos/update-profile.dto';

export const profileService = {
  updateProfile: (updateProfileDTO: UpdateProfileDTO) =>
    api.patch<User>(`/profile/update`, updateProfileDTO),
  changePassword: (changeUserPasswordDTO: ChangeUserPasswordDTO) =>
    api.post<void>(`/profile/change-password`, changeUserPasswordDTO),
};
