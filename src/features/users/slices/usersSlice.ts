import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../interfaces/UserInterface';
import type { UpdateUserDTO } from '../dtos/update-user.dto';
import { usersService } from '../services/usersService';
import type { ChangeUserPasswordDTO } from '../dtos/change-user-password.dto';

interface UsersState {
  user: User | null;
  users: User[] | [];
  error: string | null;
  loading: boolean;
}

const initialState: UsersState = {
  user: null,
  users: [],
  error: null,
  loading: false,
};

export const getAllUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const usersResponse = await usersService.getAll();
      return usersResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserById = createAsyncThunk<User, string, { rejectValue: string }>(
  'users/getById',
  async (userId, { rejectWithValue }) => {
    try {
      const userResponse = await usersService.getById(userId);
      return userResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserByUsername = createAsyncThunk<User, string, { rejectValue: string }>(
  'users/getByUsername',
  async (usuario, { rejectWithValue }) => {
    try {
      const userResponse = await usersService.getByUsername(usuario);
      return userResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUsersByRole = createAsyncThunk<User[], string, { rejectValue: string }>(
  'users/getByRole',
  async (rol, { rejectWithValue }) => {
    try {
      const usersResponse = await usersService.getByRole(rol);
      return usersResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUsersByStatus = createAsyncThunk<User[], string, { rejectValue: string }>(
  'users/getByStatus',
  async (estado, { rejectWithValue }) => {
    try {
      const usersResponse = await usersService.getByStatus(estado);
      return usersResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createUser = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  'users/create',
  async (createUserDTO, { rejectWithValue }) => {
    try {
      const response = await usersService.create(createUserDTO);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  { userId: string; updateUserDTO: UpdateUserDTO },
  { rejectValue: string }
>('users/update', async ({ userId, updateUserDTO }, { rejectWithValue }) => {
  try {
    const userResponse = await usersService.update(userId, updateUserDTO);
    return userResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Cambiar contrasena del usuario actual
export const changeUserPassword = createAsyncThunk<
  void,
  { changeUserPasswordDTO: ChangeUserPasswordDTO },
  { rejectValue: string }
>('users/changePassword', async ({ changeUserPasswordDTO }, { rejectWithValue }) => {
  try {
    const changePasswordResponse = await usersService.changePassword(changeUserPasswordDTO);
    return changePasswordResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Restablecer preferencias
export const resetUserPreferences = createAsyncThunk<User, string, { rejectValue: string }>(
  'users/resetPreferences',
  async (userId, { rejectWithValue }) => {
    try {
      const userRepsonse = await usersService.resetPreferences(userId);
      return userRepsonse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const activateUser = createAsyncThunk<void, string, { rejectValue: string }>(
  'users/activate',
  async (userId, { rejectWithValue }) => {
    try {
      await usersService.activate(userId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deactivateUser = createAsyncThunk<void, string, { rejectValue: string }>(
  'users/deactivate',
  async (userId, { rejectWithValue }) => {
    try {
      await usersService.deactivate(userId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk<void, string, { rejectValue: string }>(
  'users/delete',
  async (userId, { rejectWithValue }) => {
    try {
      await usersService.delete(userId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllUsers = createAsyncThunk<void, void, { rejectValue: string }>(
  'users/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await usersService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// metodos para usuarios ya logueados
export const updateUserSettings = createAsyncThunk<
  User,
  { configuracion: { tema?: 'claro' | 'oscuro' | 'sistema' } },
  {
    rejectValue: string;
  }
>('settings/updateSettings', async ({ configuracion }, { rejectWithValue }) => {
  try {
    const updateSettingsResponse = await usersService.updateSettings(configuracion);
    return updateSettingsResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const resetUserSettings = createAsyncThunk<User, { rejectValue: string }>(
  'settings/resetSettings',
  async (_, { rejectWithValue }) => {
    try {
      const resetSettingsResponse = await usersService.resetSettings();
      return resetSettingsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Limpiar el error
    clearUserError(state) {
      state.error = null;
    },
    // Limpiar el user antes de crear uno nuevo
    clearSelectedUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // === Obtener todos los usuarios ===
    builder.addCase(getAllUsers.pending, (state) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // === Obtener usuario por su ID ===
    builder.addCase(getUserById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Obtener usuario por el 'usuario' ===
    builder.addCase(getUserByUsername.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getUserByUsername.fulfilled, (state, action: PayloadAction<User>) => {
      (state.loading = false), (state.user = action.payload);
    });

    builder.addCase(getUserByUsername.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Obtener usuarios por su rol ===
    builder.addCase(getUsersByRole.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getUsersByRole.fulfilled, (state, action: PayloadAction<User[]>) => {
      (state.loading = false), (state.users = action.payload);
    });

    builder.addCase(getUsersByRole.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Obtener usuarios por su estado ===
    builder.addCase(getUsersByStatus.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getUsersByStatus.fulfilled, (state, action: PayloadAction<User[]>) => {
      (state.loading = false), (state.users = action.payload);
    });

    builder.addCase(getUsersByStatus.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Crear nuevo usuario ===
    builder.addCase(createUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
      (state.loading = false), (state.user = action.payload);
    });

    builder.addCase(createUser.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Actualizar usuario ===
    builder.addCase(updateUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      (state.loading = false), (state.user = action.payload);
      const idx = state.users.findIndex((u) => u._id === action.payload._id);
      if (idx !== -1) {
        state.users[idx] = action.payload;
      }
    });

    builder.addCase(updateUser.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Restablecer preferencias de un usuario ===
    builder.addCase(resetUserPreferences.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(resetUserPreferences.fulfilled, (state, action: PayloadAction<User>) => {
      (state.loading = false), (state.user = action.payload);
      const idx = state.users.findIndex((u) => u._id === action.payload._id);
      if (idx !== -1) {
        state.users[idx] = action.payload;
      }
    });

    builder.addCase(resetUserPreferences.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // === Activar usuario ===
    builder.addCase(activateUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(activateUser.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(activateUser.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Desactivar usuario ===
    builder.addCase(deactivateUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deactivateUser.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(deactivateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // === Eliminar un usuario ===
    builder.addCase(deleteUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      state.users = state.users.filter((u) => u._id !== deletedId);
    });

    builder.addCase(deleteUser.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Eliminar todos los usuarios ===
    builder.addCase(deleteAllUsers.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllUsers.fulfilled, (state) => {
      (state.loading = false), (state.users = []);
    });

    builder.addCase(deleteAllUsers.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Actualizar los ajustes del usuario ===
    builder.addCase(updateUserSettings.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateUserSettings.fulfilled, (state, action: PayloadAction<User>) => {
      (state.loading = false), (state.user = action.payload);
      const idx = state.users.findIndex((u) => u._id === action.payload._id);
      if (idx !== -1) {
        state.users[idx] = action.payload;
      }
    });

    builder.addCase(updateUserSettings.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Restablecer configuracion ===
    builder.addCase(resetUserSettings.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(resetUserSettings.fulfilled, (state, action: PayloadAction<User>) => {
      (state.loading = false), (state.user = action.payload);
      const idx = state.users.findIndex((u) => u._id === action.payload._id);
      if (idx !== -1) {
        state.users[idx] = action.payload;
      }
    });

    builder.addCase(resetUserSettings.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });
  },
});

export const { clearUserError, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
