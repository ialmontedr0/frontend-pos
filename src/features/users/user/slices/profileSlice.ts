import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../interfaces/UserInterface';
import { profileService } from '../services/profileService';
import type { UpdateProfileDTO } from '../dtos/update-profile.dto';
import type { ChangeUserPasswordDTO } from '../../dtos/change-user-password.dto';

interface ProfileState {
  profile: User | null;
  profileUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  profileUser: null,
  loading: false,
  error: null,
};

export const updateProfile = createAsyncThunk<
  User,
  { updateProfileDTO: UpdateProfileDTO },
  { rejectValue: string }
>('profile/update', async ({ updateProfileDTO }, { rejectWithValue }) => {
  try {
    const updateProfileResponse = await profileService.updateProfile(updateProfileDTO);
    return updateProfileResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const changePassword = createAsyncThunk<
  void,
  { changeUserPasswordDTO: ChangeUserPasswordDTO },
  { rejectValue: string }
>('profile/changePassword', async ({ changeUserPasswordDTO }, { rejectWithValue }) => {
  try {
    await profileService.changePassword(changeUserPasswordDTO);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
    },
    clearProfileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // === Actualizar el perfil ===
    builder.addCase(updateProfile.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
      (state.loading = false), (state.profile = action.payload);
    });

    builder.addCase(updateProfile.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Cambiar la contrasena del usuario ===
    builder.addCase(changePassword.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(changePassword.fulfilled, (state) => {
      (state.loading = false), (state.error = null);
    });

    builder.addCase(changePassword.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });
  },
});

export const { clearProfile, clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
