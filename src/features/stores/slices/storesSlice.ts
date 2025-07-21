import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Store } from '../interfaces/store.interface';
import type { CreateStoreDTO } from '../dtos/create-store.dto';
import type { UpdateStoreDTO } from '../dtos/update-store.dto';
import { storesService } from '../services/storesService';

interface StoresState {
  store: Store | null;
  stores: Store[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: StoresState = {
  store: null,
  stores: [],
  loading: false,
  error: null,
};

export const getAllStores = createAsyncThunk<Store[], void, { rejectValue: string }>(
  'stores/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const storesResponse = await storesService.getAll();
      return storesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getStoreById = createAsyncThunk<Store, string, { rejectValue: string }>(
  'stores/getById',
  async (storeId, { rejectWithValue }) => {
    try {
      const storeResponse = await storesService.getById(storeId);
      return storeResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getStoreByCode = createAsyncThunk<Store, string, { rejectValue: string }>(
  'stores/getByCode',
  async (codigo, { rejectWithValue }) => {
    try {
      const storeResponse = await storesService.getByCode(codigo);
      return storeResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createStore = createAsyncThunk<Store, CreateStoreDTO, { rejectValue: string }>(
  'stores/create',
  async (createStoreDTO, { rejectWithValue }) => {
    try {
      const storeResponse = await storesService.create(createStoreDTO);
      return storeResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateStore = createAsyncThunk<
  Store,
  { storeId: string; updateStoreDTO: UpdateStoreDTO },
  { rejectValue: string }
>('stores/update', async ({ storeId, updateStoreDTO }, { rejectWithValue }) => {
  try {
    const storeResponse = await storesService.update(storeId, updateStoreDTO);
    return storeResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteStore = createAsyncThunk<void, string, { rejectValue: string }>(
  'stores/delete',
  async (storeId, { rejectWithValue }) => {
    try {
      await storesService.delete(storeId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllStores = await createAsyncThunk<void, void, { rejectValue: string }>(
  'stores/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await storesService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    clearStoreError(state) {
      state.error = null;
    },
    clearSelectedStore(state) {
      state.store = null;
    },
  },
  extraReducers: (builder) => {
    // Obtener todas las sucursales
    builder.addCase(getAllStores.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllStores.fulfilled, (state, action: PayloadAction<Store[]>) => {
      (state.loading = false), (state.stores = action.payload);
    });

    builder.addCase(getAllStores.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo las sucursales');
    });

    // Obtener una sucursal por su ID
    builder.addCase(getStoreById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getStoreById.fulfilled, (state, action: PayloadAction<Store>) => {
      (state.loading = false), (state.store = action.payload);
    });

    builder.addCase(getStoreById.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo la sucursal');
    });

    // Obtener una sucursal por su Codigo
    builder.addCase(getStoreByCode.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getStoreByCode.fulfilled, (state, action: PayloadAction<Store>) => {
      (state.loading = false), (state.store = action.payload);
    });

    builder.addCase(getStoreByCode.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la sucursal por su codigo');
    });

    // Crear una sucursal
    builder.addCase(createStore.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createStore.fulfilled, (state, action: PayloadAction<Store>) => {
      (state.loading = false), (state.store = action.payload);
    });

    builder.addCase(createStore.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error creando la sucursal');
    });

    // Editar una sucursal
    builder.addCase(updateStore.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateStore.fulfilled, (state, action: PayloadAction<Store>) => {
      (state.loading = false), (state.store = action.payload);
      const index = state.stores.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.stores[index] = action.payload;
      }
    });

    builder.addCase(updateStore.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error actualizando la sucursal');
    });

    // Eliminar una sucursal
    builder.addCase(deleteStore.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteStore.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.stores = state.stores.filter((s) => s._id !== deletedId);
    });

    builder.addCase(deleteStore.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando la sucursal');
    });

    // Eliminar todas las sucursales
    builder.addCase(deleteAllStores.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllStores.fulfilled, (state) => {
      (state.loading = false), (state.stores = []);
    });

    builder.addCase(deleteAllStores.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando todas las sucursales');
    });
  },
});

export const { clearStoreError, clearSelectedStore } = storesSlice.actions;
export default storesSlice.reducer;
