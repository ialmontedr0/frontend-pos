import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  USER_VALIDATED_KEY,
  USER_VALIDATED_AT_KEY,
  CODE_VALIDATED_KEY,
  CODE_VALIDATED_AT_KEY,
  CODE_TTL_MS,
} from '../utils/recoveryStorage';
import type {
  LoginDTO,
  RecoverPasswordDTO,
  ValidateCodeDTO,
  ChangePasswordDTO,
  ResetPasswordDTO,
} from '../dtos/index.dto';
import type { LoginResponseDTO } from '../dtos/login-response.dto';
import { authService } from '../services/authService';
import type { User } from '../../users/interfaces/UserInterface';

interface AuthState {
  user: LoginResponseDTO['user'] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Flags para recuperacion de contrasena
  recoveryUser: string | null;
  isUserValidated: boolean;
  isCodeValidated: boolean;
  isPasswordChanged: boolean;

  loading: boolean;
  error: string | null;
}

// Helper para sabr si el timestamp esta dentro de los ultimos 10 minutos
const isTimestampValid = (storedAt: string | null): boolean => {
  if (!storedAt) return false;
  const ts = parseInt(storedAt, 10);
  if (isNaN(ts)) return false;
  return Date.now() - ts < CODE_TTL_MS;
};

// Lectura del localStorage del flag userValidated
const storedUserValidated = localStorage.getItem(USER_VALIDATED_KEY) === 'true';
const storedUserAt = localStorage.getItem(USER_VALIDATED_AT_KEY);
const initialIsUserValidated = storedUserValidated && isTimestampValid(storedUserAt);

// Leer usuario de recuperacion guardado
const storedRecoveryUser = localStorage.getItem('rp_recoveryUser') || null;

// Para el codigo OTP
const storedCodeValidated = localStorage.getItem(CODE_VALIDATED_KEY) === 'true';
const storedCodeAt = localStorage.getItem(CODE_VALIDATED_AT_KEY);
const initialIsCodeValidated = storedCodeValidated && isTimestampValid(storedCodeAt);

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),

  isUserValidated: initialIsUserValidated,
  isCodeValidated: initialIsCodeValidated,
  isPasswordChanged: false,

  recoveryUser: initialIsUserValidated ? storedRecoveryUser : null,

  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginDTO, { rejectWithValue }) => {
    try {
      const loginResponse = await authService.login(payload);
      return loginResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const restoreAuth = createAsyncThunk<
  { user: User; access_token: string; refresh_token: string } | undefined,
  void,
  { rejectValue: string }
>('auth/restore', async (_, { rejectWithValue }) => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  if (!accessToken) {
    return;
  }
  try {
    const userResponse = await authService.getCurrentUser();
    return {
      user: userResponse.data,
      access_token: accessToken,
      refresh_token: refreshToken || '',
    };
  } catch (error: any) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const recoverPassword = createAsyncThunk(
  'auth/recover',
  async (payload: RecoverPasswordDTO, { rejectWithValue }) => {
    try {
      await authService.recoverPassword(payload);
      return payload.usuario;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const validateCode = createAsyncThunk(
  'auth/validate',
  async (payload: ValidateCodeDTO, { rejectWithValue }) => {
    try {
      const validateCodeResponse = await authService.validateCode(payload);
      if (!validateCodeResponse.data.valid) {
        return rejectWithValue('Codigo incorrecto');
      }

      return payload.usuario;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/change',
  async (payload: ChangePasswordDTO, { rejectWithValue }) => {
    try {
      await authService.changePassword(payload);
      return payload.usuario;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/reset',
  async (payload: ResetPasswordDTO, { rejectWithValue }) => {
    try {
      await authService.resetPassword(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearRecoveryState(state) {
      state.isUserValidated = false;
      state.isCodeValidated = false;
      state.isPasswordChanged = false;
      state.recoveryUser = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem(USER_VALIDATED_KEY);
      localStorage.removeItem(USER_VALIDATED_AT_KEY);
      localStorage.removeItem(CODE_VALIDATED_KEY);
      localStorage.removeItem(CODE_VALIDATED_AT_KEY);
      localStorage.removeItem('rp_recoveryUser');
    },
    setCredentials(state, action: PayloadAction<LoginResponseDTO>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.isAuthenticated = true;
      localStorage.setItem('access_token', action.payload.access_token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      state.error = null;
      state.loading = false;
      // Limpiar flags de recuperacion en el logout
      state.recoveryUser = null;
      state.isUserValidated = false;
      state.isCodeValidated = false;
      state.isPasswordChanged = false;

      localStorage.removeItem(USER_VALIDATED_KEY);
      localStorage.removeItem(USER_VALIDATED_AT_KEY);
      localStorage.removeItem(CODE_VALIDATED_KEY);
      localStorage.removeItem(CODE_VALIDATED_AT_KEY);
      localStorage.removeItem('rp_recoveryUser');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<LoginResponseDTO>) => {
      authSlice.caseReducers.setCredentials(state, {
        payload: action.payload,
        type: login.fulfilled.type,
      });
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // restoreAuth
    builder.addCase(restoreAuth.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(restoreAuth.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        (state.user = action.payload.user),
          (state.accessToken = action.payload.access_token),
          (state.refreshToken = action.payload.refresh_token),
          (state.isAuthenticated = true);
      } else {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      }
    });

    builder.addCase(restoreAuth.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      authSlice.caseReducers.clearAuth(state);
    });

    // recoverPassword
    builder.addCase(recoverPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(recoverPassword.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isUserValidated = true;
      state.recoveryUser = action.payload;
      // Guardar en localStorage
      localStorage.setItem(USER_VALIDATED_KEY, 'true');
      localStorage.setItem(USER_VALIDATED_AT_KEY, Date.now().toString());
      localStorage.setItem('rp_recoveryUser', action.payload);
    });
    builder.addCase(recoverPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isUserValidated = false;
      state.recoveryUser = null;
    });

    // validateCode
    builder.addCase(validateCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(validateCode.fulfilled, (state) => {
      state.loading = false;
      state.isCodeValidated = true;
      localStorage.setItem(CODE_VALIDATED_KEY, 'true');
      localStorage.setItem(CODE_VALIDATED_AT_KEY, Date.now().toString());
    });
    builder.addCase(validateCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isCodeValidated = false;
    });

    // changePassword
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
      state.isPasswordChanged = true;
      state.isUserValidated = false;
      state.isCodeValidated = false;
      localStorage.removeItem(USER_VALIDATED_KEY);
      localStorage.removeItem(USER_VALIDATED_AT_KEY);
      localStorage.removeItem(CODE_VALIDATED_KEY);
      localStorage.removeItem(CODE_VALIDATED_AT_KEY);
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isPasswordChanged = false;
    });

    // resetPassword
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearRecoveryState, setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
