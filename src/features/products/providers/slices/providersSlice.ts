import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Provider } from '../interfaces/ProviderInterface';
import type { CreateProviderDTO } from '../dtos/create-provider.dto';
import type { UpdateProviderDTO } from '../dtos/update-provider.dto';
import { providersService } from '../services/providersService';

interface ProviderState {
  provider: Provider | null;
  providers: Provider[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: ProviderState = {
  provider: null,
  providers: [],
  loading: false,
  error: null,
};

export const getAllProviders = createAsyncThunk<Provider[], void, { rejectValue: string }>(
  'providers/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const providersResponse = await providersService.getAll();
      return providersResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProviderById = createAsyncThunk<Provider, string, { rejectValue: string }>(
  'providers/getById',
  async (providerId, { rejectWithValue }) => {
    try {
      const providerResponse = await providersService.getById(providerId);
      return providerResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProviderByRNC = createAsyncThunk<Provider, string, { rejectValue: string }>(
  'providers/getByRNC',
  async (RNC, { rejectWithValue }) => {
    try {
      const providerResponse = await providersService.getByRNC(RNC);
      return providerResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProvider = createAsyncThunk<
  Provider,
  CreateProviderDTO,
  { rejectValue: string }
>('providers/create', async (createProviderDTO, { rejectWithValue }) => {
  try {
    const providerResponse = await providersService.create(createProviderDTO);
    return providerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProvider = createAsyncThunk<
  Provider,
  { providerId: string; updateProviderDTO: UpdateProviderDTO },
  { rejectValue: string }
>('providers/update', async ({ providerId, updateProviderDTO }, { rejectWithValue }) => {
  try {
    const providerResponse = await providersService.update(providerId, updateProviderDTO);
    return providerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteProvider = createAsyncThunk<void, string, { rejectValue: string }>(
  'providers/delete',
  async (providerId, { rejectWithValue }) => {
    try {
      await providersService.delete(providerId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllProviders = createAsyncThunk<void, void, { rejectValue: string }>(
  'providers/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await providersService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    clearProviderError(state) {
      state.error = null;
    },
    clearSelectedProvider(state) {
      state.provider = null;
    },
  },
  extraReducers: (builder) => {
    // === Obtener todos los proveedores ===
    builder.addCase(getAllProviders.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllProviders.fulfilled, (state, action: PayloadAction<Provider[]>) => {
      state.loading = false;
      state.providers = action.payload;
    });

    builder.addCase(getAllProviders.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error al obtener los proveedores';
    });

    // === Obtener un proveedor por su ID ===
    builder.addCase(getProviderById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getProviderById.fulfilled, (state, action: PayloadAction<Provider>) => {
      (state.loading = false), (state.provider = action.payload);
    });

    builder.addCase(getProviderById.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error al obtener el proveedor';
    });

    // === Obtner un proveedor por su RNC ===
    builder.addCase(getProviderByRNC.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getProviderByRNC.fulfilled, (state, action: PayloadAction<Provider>) => {
      (state.loading = false), (state.provider = action.payload);
    });

    builder.addCase(getProviderByRNC.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error al obtener el proveedor';
    });

    // === Crear un nuevo proveedor ===
    builder.addCase(createProvider.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createProvider.fulfilled, (state, action: PayloadAction<Provider>) => {
      (state.loading = false), (state.provider = action.payload);
    });

    builder.addCase(createProvider.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error al crear el proveedor';
    });

    // === Actualizar un provedor ===
    builder.addCase(updateProvider.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateProvider.fulfilled, (state, action: PayloadAction<Provider>) => {
      state.loading = false;
      state.provider = action.payload;
      const idx = state.providers.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.providers[idx] = action.payload;
      }
    });

    builder.addCase(updateProvider.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error al actualizar el proveedor';
    });

    // === Eliminar un proveedor ===
    builder.addCase(deleteProvider.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteProvider.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      state.providers = state.providers.filter((c) => c._id !== deletedId);
    });

    builder.addCase(deleteProvider.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error al eliminar el proveedor';
    });

    // === Eliminar todos los proveedores ===
    builder.addCase(deleteAllProviders.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllProviders.fulfilled, (state) => {
      (state.loading = false), (state.providers = []);
    });

    builder.addCase(deleteAllProviders.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error al eliminar los proveedores';
    });
  },
});

export const { clearProviderError, clearSelectedProvider } = providersSlice.actions;
export default providersSlice.reducer;
