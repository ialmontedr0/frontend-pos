import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Payment } from '../interfaces/PaymentInterface';
import type { CreatePaymentDTO } from '../dtos/create-payment.dto';
import { paymentsService } from '../services/paymentsService';

interface PaymentState {
  payment: Payment | null;
  payments: Payment[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payment: null,
  payments: [],
  loading: false,
  error: null,
};

export const getAllPayments = createAsyncThunk<Payment[], void, { rejectValue: string }>(
  'payments/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const paymentsResponse = await paymentsService.findAll();
      return paymentsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getPaymentById = createAsyncThunk<Payment, string, { rejectValue: string }>(
  'payments/getById',
  async (paymentId, { rejectWithValue }) => {
    try {
      const paymentResponse = await paymentsService.findById(paymentId);
      return paymentResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getPaymentsBySale = createAsyncThunk<Payment[], string, { rejectValue: string }>(
  'payments/getBySale',
  async (saleId, { rejectWithValue }) => {
    try {
      const paymentsResponse = await paymentsService.findBySale(saleId);
      return paymentsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getPaymentsByCustomer = createAsyncThunk<Payment[], string, { rejectValue: string }>(
  'payments/getByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const paymentsResponse = await paymentsService.findByCustomer(customerId);
      return paymentsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getPaymentsByUser = createAsyncThunk<Payment[], string, { rejectValue: string }>(
  'payments/getByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const paymentsResponse = await paymentsService.findByUser(userId);
      return paymentsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPayment = createAsyncThunk<Payment, CreatePaymentDTO, { rejectValue: string }>(
  'payments/create',
  async (createPaymentDTO, { rejectWithValue }) => {
    try {
      const paymentResponse = await paymentsService.create(createPaymentDTO);
      return paymentResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletePayment = createAsyncThunk<void, string, { rejectValue: string }>(
  'payments/delete',
  async (paymentId, { rejectWithValue }) => {
    try {
      await paymentsService.delete(paymentId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllPayments = createAsyncThunk<void, void, { rejectValue: string }>(
  'payments/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await paymentsService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentError(state) {
      state.error = null;
    },
    clearSelectedPayment(state) {
      state.payment = null;
    },
  },
  extraReducers: (builder) => {
    // === Obtener todos los pagos ===
    builder.addCase(getAllPayments.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      (state.loading = false), (state.payments = action.payload);
    });

    builder.addCase(getAllPayments.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || 'Error al ');
    });

    // === Obtener un pago por su ID ===
    builder.addCase(getPaymentById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getPaymentById.fulfilled, (state, action: PayloadAction<Payment>) => {
      (state.loading = false), (state.payment = action.payload);
    });

    builder.addCase(getPaymentById.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || 'Error al ');
    });

    // === Obtener todos los pagos de una venta ===
    builder.addCase(getPaymentsBySale.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getPaymentsBySale.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      (state.loading = false), (state.payments = action.payload);
    });

    builder.addCase(getPaymentsBySale.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || 'Error al ');
    });

    // === Obtener todos los pagos de un cliente ===
    builder.addCase(getPaymentsByCustomer.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getPaymentsByCustomer.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      (state.loading = false), (state.payments = action.payload);
    });

    builder.addCase(getPaymentsByCustomer.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || 'Error al ');
    });

    // === Obtener todos los pagos de un usuario ===
    builder.addCase(getPaymentsByUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getPaymentsByUser.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      (state.loading = false), (state.payments = action.payload);
    });

    builder.addCase(getPaymentsByUser.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || 'Error al ');
    });

    // === Crear un pago ===
    builder.addCase(createPayment.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createPayment.fulfilled, (state, action: PayloadAction<Payment>) => {
      (state.loading = false), (state.payment = action.payload);
    });

    builder.addCase(createPayment.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || 'Error al ');
    });

    // === Eliminar un pago ===
    builder.addCase(deletePayment.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deletePayment.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.payments = state.payments.filter((payment) => payment._id !== deletedId);
    });

    builder.addCase(deletePayment.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || 'Error al ');
    });

    // === Eliminar todos los pagos ===
    builder.addCase(deleteAllPayments.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllPayments.fulfilled, (state) => {
      (state.loading = false), (state.payments = []);
    });

    builder.addCase(deleteAllPayments.rejected, (state, action) => {
      (state.loading = false), (state.error = (action.payload as string) || 'Error al ');
    });
  },
});

export const { clearPaymentError, clearSelectedPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer