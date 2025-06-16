import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Sale } from '../interfaces/SaleInterface';
import type { CreateSaleDTO } from '../dtos/create-sale.dto';
import { salesService } from '../services/salesService';

interface SaleState {
  sale: Sale | null;
  sales: Sale[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: SaleState = {
  sale: null,
  sales: [],
  loading: false,
  error: null,
};

export const getAllSales = createAsyncThunk<Sale[], void, { rejectValue: string }>(
  'sales/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const salesResponse = await salesService.getAll();
      return salesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllSalesForCurrentUser = createAsyncThunk<Sale[], void, { rejectValue: string }>(
  'sales/getAllForCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const salesResponse = await salesService.getAllForCurrentUser();
      return salesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSaleById = createAsyncThunk<Sale, string, { rejectValue: string }>(
  'sales/getById',
  async (saleId, { rejectWithValue }) => {
    try {
      const saleResponse = await salesService.getById(saleId);
      return saleResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSaleByCode = createAsyncThunk<Sale, string, { rejectValue: string }>(
  'sales/getByCode',
  async (codigo, { rejectWithValue }) => {
    try {
      const saleResponse = await salesService.getByCode(codigo);
      return saleResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSalesByUser = createAsyncThunk<Sale[], string, { rejectValue: string }>(
  'sales/getByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const userSalesResponse = await salesService.getByUser(userId);
      return userSalesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSalesByCustomer = createAsyncThunk<Sale[], string, { rejectValue: string }>(
  'sales/getByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const customerSalesResponse = await salesService.getByCustomer(customerId);
      return customerSalesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSale = createAsyncThunk<Sale, CreateSaleDTO, { rejectValue: string }>(
  'sales/create',
  async (createSaleDTO, { rejectWithValue }) => {
    try {
      const saleResponse = await salesService.create(createSaleDTO);
      return saleResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSale = createAsyncThunk<void, string, { rejectValue: string }>(
  'sales/delete',
  async (saleId, { rejectWithValue }) => {
    try {
      await salesService.delete(saleId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllSales = createAsyncThunk<void, void, { rejectValue: string }>(
  'sales/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await salesService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearSaleError(state) {
      state.error = null;
    },
    clearSelectedSale(state) {
      state.sale = null;
    },
  },
  extraReducers: (builder) => {
    // === Obtener todas las ventas
    builder.addCase(getAllSales.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllSales.fulfilled, (state, action: PayloadAction<Sale[]>) => {
      (state.loading = false), (state.sales = action.payload);
    });

    builder.addCase(getAllSales.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo las ventas');
    });

    builder.addCase(getAllSalesForCurrentUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllSalesForCurrentUser.fulfilled, (state, action: PayloadAction<Sale[]>) => {
      (state.loading = false), (state.sales = action.payload);
    });

    builder.addCase(getAllSalesForCurrentUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = action.payload as string | 'Error obteniendo las ventas');
    });

    // === Obtener una venta por su ID
    builder.addCase(getSaleById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getSaleById.fulfilled, (state, action: PayloadAction<Sale>) => {
      (state.loading = false), (state.sale = action.payload);
    });

    builder.addCase(getSaleById.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo la venta');
    });

    // === Obtener una venta por su codigo
    builder.addCase(getSaleByCode.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getSaleByCode.fulfilled, (state, action: PayloadAction<Sale>) => {
      (state.loading = false), (state.sale = action.payload);
    });

    builder.addCase(getSaleByCode.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo la venta');
    });

    // === Obtener las ventas de un usuario
    builder.addCase(getSalesByUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getSalesByUser.fulfilled, (state, action: PayloadAction<Sale[]>) => {
      (state.loading = false), (state.sales = action.payload);
    });

    builder.addCase(getSalesByUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo las ventas');
    });

    // === Obtener las ventas de un cliente
    builder.addCase(getSalesByCustomer.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getSalesByCustomer.fulfilled, (state, action: PayloadAction<Sale[]>) => {
      (state.loading = false), (state.sales = action.payload);
    });

    builder.addCase(getSalesByCustomer.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo las ventas');
    });

    // === Crear una venta
    builder.addCase(createSale.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createSale.fulfilled, (state, action: PayloadAction<Sale>) => {
      (state.loading = false), (state.sale = action.payload);
    });

    builder.addCase(createSale.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error creando la venta');
    });

    // === Eliminar una venta
    builder.addCase(deleteSale.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteSale.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.sales = state.sales.filter((sale) => sale._id !== deletedId);
    });

    builder.addCase(deleteSale.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando la venta');
    });

    // === Eliminar todas las ventas
    builder.addCase(deleteAllSales.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllSales.fulfilled, (state) => {
      (state.loading = false), (state.sales = []);
    });

    builder.addCase(deleteAllSales.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || '');
    });
  },
});

export const { clearSaleError, clearSelectedSale } = salesSlice.actions;
export default salesSlice.reducer;
