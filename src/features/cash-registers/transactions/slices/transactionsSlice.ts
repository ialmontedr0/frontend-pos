import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { transactionsService } from '../services/transactionsServices';
import type { Transaction } from '../../interfaces/TransactionInterface';

interface TransactionState {
  transaction: Transaction | null;
  transactions: Transaction[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transaction: null,
  transactions: [],
  loading: false,
  error: null,
};

// Thunks
export const getAllTransactions = createAsyncThunk<Transaction[], void, { rejectValue: string }>(
  'transactions/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const transactionsResponse = await transactionsService.getAll();
      return transactionsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTransactionByID = createAsyncThunk<Transaction, string, { rejectValue: string }>(
  'transactions/getById',
  async (transactionId, { rejectWithValue }) => {
    try {
      const transactionResponse = await transactionsService.getById(transactionId);
      return transactionResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);

export const getAllTransactionsForCurrentUser = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string }
>('transactions/getAllForCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const transactionsResponse = await transactionsService.getByCurrentUser();
    return transactionsResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getAllTransactionsForUser = createAsyncThunk<
  Transaction[],
  string,
  { rejectValue: string }
>('transactions/getAllForUser', async (userId, { rejectWithValue }) => {
  try {
    const transactionsResponse = await transactionsService.getByUser(userId);
    return transactionsResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError(state) {
      state.error = null;
    },
    clearSelectedTransaction(state) {
      state.transaction = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTransactions.pending, (state) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(getAllTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
      (state.loading = false), (state.transactions = action.payload);
    });
    builder.addCase(getAllTransactions.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener todas las transacciones');
    });

    builder.addCase(getTransactionByID.pending, (state) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(getTransactionByID.fulfilled, (state, action: PayloadAction<Transaction>) => {
      (state.loading = false), (state.transaction = action.payload);
    });
    builder.addCase(getTransactionByID.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la transaccion');
    });

    builder.addCase(getAllTransactionsForCurrentUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getAllTransactionsForCurrentUser.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        (state.loading = false), (state.transactions = action.payload);
      }
    );

    builder.addCase(getAllTransactionsForCurrentUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error =
          (action.payload as string) || 'Error al obtener las transacciones del usuario');
    });

    builder.addCase(getAllTransactionsForUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getAllTransactionsForUser.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        (state.loading = false), (state.transactions = action.payload);
      }
    );

    builder.addCase(getAllTransactionsForUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error =
          (action.payload as string) || 'Error al obtener las transacciones del usuario');
    });
  },
});

export const { clearSelectedTransaction, clearTransactionError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
