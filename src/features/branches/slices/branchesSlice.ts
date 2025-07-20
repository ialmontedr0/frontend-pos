import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Branche } from '../interfaces/branche.interface';
import type { CreateBrancheDTO } from '../dtos/create-branche.dto';
import type { UpdateBrancheDTO } from '../dtos/update-branche.dto';
import { branchesService } from '../services/branchesService';

interface BranchesState {
  branche: Branche | null;
  branches: Branche[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: BranchesState = {
  branche: null,
  branches: [],
  loading: false,
  error: null,
};

export const getAllBranches = createAsyncThunk<Branche[], void, { rejectValue: string }>(
  'branches/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const branchesResponse = await branchesService.getAll();
      return branchesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getBrancheById = createAsyncThunk<Branche, string, { rejectValue: string }>(
  'branches/getById',
  async (brancheId, { rejectWithValue }) => {
    try {
      const brancheResponse = await branchesService.getById(brancheId);
      return brancheResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBranche = createAsyncThunk<Branche, CreateBrancheDTO, { rejectValue: string }>(
  'branches/create',
  async (createBrancheDTO, { rejectWithValue }) => {
    try {
      const brancheResponse = await branchesService.create(createBrancheDTO);
      return brancheResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBranche = createAsyncThunk<
  Branche,
  { brancheId: string; updateBrancheDTO: UpdateBrancheDTO },
  { rejectValue: string }
>('branches/update', async ({ brancheId, updateBrancheDTO }, { rejectWithValue }) => {
  try {
    const brancheResponse = await branchesService.update(brancheId, updateBrancheDTO);
    return brancheResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteBranche = createAsyncThunk<void, string, { rejectValue: string }>(
  'branche/delete',
  async (brancheId, { rejectWithValue }) => {
    try {
      await branchesService.delete(brancheId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllBranches = await createAsyncThunk<void, void, { rejectValue: string }>(
  'branches/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await branchesService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    clearBrancheError(state) {
      state.error = null;
    },
    clearSelectedBranche(state) {
      state.branche = null;
    },
  },
  extraReducers: (builder) => {
    // Obtener todas las sucursales
    builder.addCase(getAllBranches.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllBranches.fulfilled, (state, action: PayloadAction<Branche[]>) => {
      (state.loading = false), (state.branches = action.payload);
    });

    builder.addCase(getAllBranches.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo las sucursales');
    });

    // Obtener una sucursal por su ID
    builder.addCase(getBrancheById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getBrancheById.fulfilled, (state, action: PayloadAction<Branche>) => {
      (state.loading = false), (state.branche = action.payload);
    });

    builder.addCase(getBrancheById.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo la sucursal');
    });

    // Crear una sucursal
    builder.addCase(createBranche.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createBranche.fulfilled, (state, action: PayloadAction<Branche>) => {
      (state.loading = false), (state.branche = action.payload);
    });

    builder.addCase(createBranche.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error creando la sucursal');
    });

    // Editar una sucursal
    builder.addCase(updateBranche.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateBranche.fulfilled, (state, action: PayloadAction<Branche>) => {
      (state.loading = false), (state.branche = action.payload);
      const index = state.branches.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.branches[index] = action.payload;
      }
    });

    builder.addCase(updateBranche.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error actualizando la sucursal');
    });

    // Eliminar una sucursal
    builder.addCase(deleteBranche.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteBranche.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.branches = state.branches.filter((b) => b._id !== deletedId);
    });

    builder.addCase(deleteBranche.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando la sucursal');
    });

    // Eliminar todas las sucursales
    builder.addCase(deleteAllBranches.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllBranches.fulfilled, (state) => {
      (state.loading = false), (state.branches = []);
    });

    builder.addCase(deleteAllBranches.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando todas las sucursales');
    });
  },
});

export const { clearBrancheError, clearSelectedBranche } = branchesSlice.actions;
export default branchesSlice.reducer;