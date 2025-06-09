import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Customer } from '../interfaces/CustomerInterface';
import type { CreateCustomerDTO } from '../dtos/create-customer.dto';
import type { UpdateCustomerDTO } from '../dtos/update-customer.dto';
import { customersService } from '../services/customersService';

interface CustomerState {
  customer: Customer | null;
  customers: Customer[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customer: null,
  customers: [],
  loading: false,
  error: null,
};

export const getAllCustomers = createAsyncThunk<Customer[], void, { rejectValue: string }>(
  'customers/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const customersResponse = await customersService.getAll();
      return customersResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getCustomerById = createAsyncThunk<Customer, string, { rejectValue: string }>(
  'customers/getById',
  async (customerId, { rejectWithValue }) => {
    try {
      const customerResponse = await customersService.getById(customerId);
      return customerResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCustomer = createAsyncThunk<
  Customer,
  CreateCustomerDTO,
  { rejectValue: string }
>('customers/create', async (createCustomerDTO, { rejectWithValue }) => {
  try {
    const response = await customersService.create(createCustomerDTO);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateCustomer = createAsyncThunk<
  Customer,
  { customerId: string; updateCustomerDTO: UpdateCustomerDTO },
  { rejectValue: string }
>('customers/update', async ({ customerId, updateCustomerDTO }, { rejectWithValue }) => {
  try {
    const customerResponse = await customersService.update(customerId, updateCustomerDTO);
    return customerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteCustomer = createAsyncThunk<void, string, { rejectValue: string }>(
  'customers/delete',
  async (customerId, { rejectWithValue }) => {
    try {
      await customersService.delete(customerId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllCustomers = createAsyncThunk<void, void, { rejectValue: string }>(
  'customers/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await customersService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomerError(state) {
      state.error = null;
    },
    clearSelectedCustomer(state) {
      state.customer = null;
    },
  },
  extraReducers: (builder) => {
    // === Obtener todos los clientes ===
    builder.addCase(getAllCustomers.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
      (state.loading = false), (state.customers = action.payload);
    });

    builder.addCase(getAllCustomers.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener los clientes');
    });

    // === Obtener cliente por su ID ===
    builder.addCase(getCustomerById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getCustomerById.fulfilled, (state, action: PayloadAction<Customer>) => {
      (state.loading = false), (state.customer = action.payload);
    });

    builder.addCase(getCustomerById.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener el cliente');
    });

    // === Crear cliente ===
    builder.addCase(createCustomer.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
      (state.loading = false), (state.customer = action.payload);
    });

    builder.addCase(createCustomer.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error creando el cliente');
    });

    // === Actualizar cliente ===
    builder.addCase(updateCustomer.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
      (state.loading = false), (state.customer = action.payload);
      const idx = state.customers.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) {
        state.customers[idx] = action.payload;
      }
    });

    builder.addCase(updateCustomer.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error actualizando el cliente');
    });

    // === Eliminar un cliente ===
    builder.addCase(deleteCustomer.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      state.customers = state.customers.filter((c) => c._id !== deletedId);
    });

    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error eliminando el cliente';
    });

    // === Eliminar todos los clientes ===
    builder.addCase(deleteAllCustomers.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllCustomers.fulfilled, (state) => {
      state.loading = false;
      state.customers = [];
    });

    builder.addCase(deleteAllCustomers.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando los clientes');
    });
  },
});

export const { clearCustomerError, clearSelectedCustomer } = customersSlice.actions;
export default customersSlice.reducer;
