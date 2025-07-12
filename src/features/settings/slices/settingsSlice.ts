import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Settings } from '../interfaces/SettingsInterface';
import { settingsService } from '../services/settingsService';
import type { UpdateSettingsDTO } from '../dtos/update-settings.dto';

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

export const getAppSettings = createAsyncThunk<Settings, void, { rejectValue: string }>(
  'settings/get',
  async (_, { rejectWithValue }) => {
    try {
      const settingsResponse = await settingsService.get();
      return settingsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAppSettings = createAsyncThunk<
  Settings,
  { dto: UpdateSettingsDTO },
  { rejectValue: string }
>('settings/update', async ({ dto }, { rejectWithValue }) => {
  try {
    const updateResponse = await settingsService.update(dto);
    return updateResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAppSettings.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAppSettings.fulfilled, (state, action: PayloadAction<Settings>) => {
      (state.loading = false), (state.settings = action.payload);
    });

    builder.addCase(getAppSettings.rejected, (state, action) => {
      (state.loading = false),
        (state.error =
          (action.payload as string) || 'Error al obtener la configuracion del sistema');
    });

    builder.addCase(updateAppSettings.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateAppSettings.fulfilled, (state, action: PayloadAction<Settings>) => {
      (state.loading = false), (state.settings = action.payload);
    });

    builder.addCase(updateAppSettings.rejected, (state, action) => {
      (state.loading = false),
        (state.error =
          (action.payload as string) || 'Error al actualizar la configuracion del sistema');
    });
  },
});

export default settingsSlice.reducer;
