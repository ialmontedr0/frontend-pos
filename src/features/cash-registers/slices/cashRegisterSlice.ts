import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { cashRegisterService } from '../services/cashRegisterService';
import type { CashRegister } from '../interfaces/CashRegisterInterface';
import type { CreateRegisterDTO } from '../dtos/create-register.dto';
import type { UpdateRegisterDTO } from '../dtos/update-register.dto';
import type { OpenRegisterDTO } from '../dtos/open-register.dto';
import type { CloseRegisterDTO } from '../dtos/close-register.dto';
import type { RegisterTransactionDTO } from '../dtos/register-transaction.dto';
import type { Transaction } from '../interfaces/TransactionInterface';

interface CashRegisterState {
  cashRegister: CashRegister | null;
  cashRegisters: CashRegister[] | [];
  transaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: CashRegisterState = {
  cashRegister: null,
  cashRegisters: [],
  transaction: null,
  loading: false,
  error: null,
};

// Thunks
export const getAllCashRegisters = createAsyncThunk<CashRegister[], void, { rejectValue: string }>(
  'cashRegisters/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const registersResponse = await cashRegisterService.getAll();
      return registersResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getCashRegisterById = createAsyncThunk<CashRegister, string, { rejectValue: string }>(
  'cashRegisters/getById',
  async (cashRegisterId, { rejectWithValue }) => {
    try {
      const registerResponse = await cashRegisterService.getById(cashRegisterId);
      return registerResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getCashRegisterByCode = createAsyncThunk<
  CashRegister,
  string,
  { rejectValue: string }
>('cashRegisters/getByCode', async (codigo, { rejectWithValue }) => {
  try {
    const registerResponse = await cashRegisterService.getByCode(codigo);
    return registerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getCashRegistersForUser = createAsyncThunk<
  CashRegister[],
  string,
  { rejectValue: string }
>('cashRegisters/getForUser', async (userId, { rejectWithValue }) => {
  try {
    const registersResponse = await cashRegisterService.getByUser(userId);
    return registersResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getAllCashRegistersForCurrentUser = createAsyncThunk<
  CashRegister[],
  void,
  { rejectValue: string }
>('cashRegisters/getAllForCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const registersResponse = await cashRegisterService.getForCurrentUser();
    return registersResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getOpenCashRegisters = createAsyncThunk<CashRegister[], void, { rejectValue: string }>(
  'cashRegisters/getOpen',
  async (_, { rejectWithValue }) => {
    try {
      const openCashRegister = await cashRegisterService.getOpen();
      return openCashRegister.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getOpenCashRegisterForCurrentUser = createAsyncThunk<
  CashRegister,
  void,
  { rejectValue: string }
>('cashRegisters/getOpenForCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const registerResponse = await cashRegisterService.getOpenForCurrentUser();
    return registerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.respone?.data?.message || error.message);
  }
});

export const getClosedCashRegisters = createAsyncThunk<
  CashRegister[],
  void,
  { rejectValue: string }
>('cashRegisters/getClosed', async (_, { rejectWithValue }) => {
  try {
    const closedRegisters = await cashRegisterService.getClosed();
    return closedRegisters.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getAssignedCashRegisterForUser = createAsyncThunk<
  CashRegister,
  string,
  { rejectValue: string }
>('cashRegisters/getAssignedForUser', async (userId, { rejectWithValue }) => {
  try {
    const assignedRegisters = await cashRegisterService.getAssignedForUser(userId);
    return assignedRegisters.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getAssignedCashRegisterForCurrentUser = createAsyncThunk<
  CashRegister[],
  void,
  { rejectValue: string }
>('cashRegisters/getAssignedForCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const assignedCashRegister = await cashRegisterService.getAssignedForCurrentUser();
    return assignedCashRegister.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createCashRegister = createAsyncThunk<
  CashRegister,
  CreateRegisterDTO,
  { rejectValue: string }
>('cashRegisters/create', async (createRegisterDTO, { rejectWithValue }) => {
  try {
    const registerResponse = await cashRegisterService.create(createRegisterDTO);
    return registerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateCashRegister = createAsyncThunk<
  CashRegister,
  { cashRegisterId: string; updateRegisterDTO: UpdateRegisterDTO },
  { rejectValue: string }
>('cashRegisters/update', async ({ cashRegisterId, updateRegisterDTO }, { rejectWithValue }) => {
  try {
    const registerResponse = await cashRegisterService.update(cashRegisterId, updateRegisterDTO);
    return registerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const assignCashRegisterToUser = createAsyncThunk<
  CashRegister,
  { userId: string; registerId: string },
  { rejectValue: string }
>('cashRegisters/assignToUser', async ({ userId, registerId }, { rejectWithValue }) => {
  try {
    const registerResponse = await cashRegisterService.assign(userId, registerId);
    return registerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const openCashRegister = createAsyncThunk<
  CashRegister,
  { cashRegisterId: string; openRegisterDTO: OpenRegisterDTO },
  { rejectValue: string }
>('cashRegisters/open', async ({ cashRegisterId, openRegisterDTO }, { rejectWithValue }) => {
  try {
    const registerResponse = await cashRegisterService.open(cashRegisterId, openRegisterDTO);
    return registerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const closeCashRegister = createAsyncThunk<
  CashRegister,
  { cashRegisterId: string; closeRegisterDTO: CloseRegisterDTO },
  { rejectValue: string }
>('cashRegisters/close', async ({ cashRegisterId, closeRegisterDTO }, { rejectWithValue }) => {
  try {
    const registerResponse = await cashRegisterService.close(cashRegisterId, closeRegisterDTO);
    return registerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const registerTransaction = createAsyncThunk<
  CashRegister,
  { cashRegisterId: string; registerTransactionDTO: RegisterTransactionDTO },
  { rejectValue: string }
>(
  'cashRegisters/register',
  async ({ cashRegisterId, registerTransactionDTO }, { rejectWithValue }) => {
    try {
      const registerResponse = await cashRegisterService.registerTransaction(
        cashRegisterId,
        registerTransactionDTO
      );
      return registerResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const closeAllCashRegisters = createAsyncThunk<void, void, { rejectValue: string }>(
  'cashRegisters/closeAll',
  async (_, { rejectWithValue }) => {
    try {
      await cashRegisterService.closeAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCashRegister = createAsyncThunk<void, string, { rejectValue: string }>(
  'cashRegisters/delete',
  async (cashRegisterId, { rejectWithValue }) => {
    try {
      await cashRegisterService.delete(cashRegisterId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllCashRegisters = createAsyncThunk<void, void, { rejectValue: string }>(
  'cashRegisters/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await cashRegisterService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cashRegistersSlice = createSlice({
  name: 'cashRegisters',
  initialState,
  reducers: {
    clearCashRegisterError(state) {
      state.error = null;
    },
    clearSelectedCashRegister(state) {
      state.cashRegister = null;
    },
  },
  extraReducers: (builder) => {
    // 1. === Obtener todas las cajas ===
    builder.addCase(getAllCashRegisters.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getAllCashRegisters.fulfilled,
      (state, action: PayloadAction<CashRegister[]>) => {
        (state.loading = false), (state.cashRegisters = action.payload);
      }
    );

    builder.addCase(getAllCashRegisters.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las cajas');
    });

    // 2. === Obtener una caja por su ID ===
    builder.addCase(getCashRegisterById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getCashRegisterById.fulfilled, (state, action: PayloadAction<CashRegister>) => {
      (state.loading = false), (state.cashRegister = action.payload);
    });

    builder.addCase(getCashRegisterById.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las cajas');
    });

    // 3. === Obtener una caja pro su codigo ===
    builder.addCase(getCashRegisterByCode.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getCashRegisterByCode.fulfilled,
      (state, action: PayloadAction<CashRegister>) => {
        (state.loading = false), (state.cashRegister = action.payload);
      }
    );

    builder.addCase(getCashRegisterByCode.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la caja');
    });

    // 4. === Obtener todas las cajas de un usuario ===
    builder.addCase(getCashRegistersForUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getCashRegistersForUser.fulfilled,
      (state, action: PayloadAction<CashRegister[]>) => {
        (state.loading = false), (state.cashRegisters = action.payload);
      }
    );

    builder.addCase(getCashRegistersForUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las cajas');
    });

    // 5. === Obtener las cajas del usuario actual ===
    builder.addCase(getAllCashRegistersForCurrentUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getAllCashRegistersForCurrentUser.fulfilled,
      (state, action: PayloadAction<CashRegister[]>) => {
        (state.loading = false), (state.cashRegisters = action.payload);
      }
    );

    builder.addCase(getAllCashRegistersForCurrentUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las cajas');
    });

    // 6. Obtener todas las cajas abiertas
    builder.addCase(getOpenCashRegisters.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getOpenCashRegisters.fulfilled,
      (state, action: PayloadAction<CashRegister[]>) => {
        (state.loading = false), (state.cashRegisters = action.payload);
      }
    );

    builder.addCase(getOpenCashRegisters.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las cajas abiertas');
    });

    // 7. Obtener todas las cajas registradoras del usuario actual
    builder.addCase(getOpenCashRegisterForCurrentUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getOpenCashRegisterForCurrentUser.fulfilled,
      (state, action: PayloadAction<CashRegister>) => {
        (state.loading = false), (state.cashRegister = action.payload);
      }
    );

    builder.addCase(getOpenCashRegisterForCurrentUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la caja registradora');
    });

    // 8. Obtener las cajas cerradas
    builder.addCase(getClosedCashRegisters.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getClosedCashRegisters.fulfilled,
      (state, action: PayloadAction<CashRegister[]>) => {
        (state.loading = false), (state.cashRegisters = action.payload);
      }
    );

    builder.addCase(getClosedCashRegisters.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las cajas cerradas');
    });

    // 8. Obtener las cajas asignadas al usuario
    builder.addCase(getAssignedCashRegisterForUser.pending, (state) => {
      (state.loading = false), (state.error = null);
    });

    builder.addCase(
      getAssignedCashRegisterForUser.fulfilled,
      (state, action: PayloadAction<CashRegister>) => {
        (state.loading = false), (state.cashRegister = action.payload);
      }
    );

    builder.addCase(getAssignedCashRegisterForUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la caja registradora');
    });

    // 9. Obtener las cajas asignadas al usuario actual
    builder.addCase(getAssignedCashRegisterForCurrentUser.pending, (state) => {
      (state.loading = false), (state.error = null);
    });

    builder.addCase(
      getAssignedCashRegisterForCurrentUser.fulfilled,
      (state, action: PayloadAction<CashRegister[]>) => {
        (state.loading = false), (state.cashRegisters = action.payload);
      }
    );

    builder.addCase(getAssignedCashRegisterForCurrentUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la caja registradora');
    });

    // 10. === Crear una caja ===
    builder.addCase(createCashRegister.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createCashRegister.fulfilled, (state, action: PayloadAction<CashRegister>) => {
      (state.loading = false), (state.cashRegister = action.payload);
    });

    builder.addCase(createCashRegister.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al crear la caja');
    });

    // 11. === Actualizar una caja ===
    builder.addCase(updateCashRegister.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateCashRegister.fulfilled, (state, action: PayloadAction<CashRegister>) => {
      (state.loading = false), (state.cashRegister = action.payload);
      const index = state.cashRegisters.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.cashRegisters[index] = action.payload;
      }
    });

    builder.addCase(updateCashRegister.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al actualizar la caja');
    });

    // 12. Asignar una caja al usuario
    builder.addCase(assignCashRegisterToUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      assignCashRegisterToUser.fulfilled,
      (state, action: PayloadAction<CashRegister>) => {
        (state.loading = false), (state.cashRegister = action.payload);
      }
    );

    builder.addCase(assignCashRegisterToUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al asignar el usuario a la caja');
    });

    // 13. === Abrir una caja ===
    builder.addCase(openCashRegister.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(openCashRegister.fulfilled, (state, action: PayloadAction<CashRegister>) => {
      (state.loading = false), (state.cashRegister = action.payload);
    });

    builder.addCase(openCashRegister.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al abrir la caja');
    });

    // 14. === Cerrar una caja ===
    builder.addCase(closeCashRegister.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(closeCashRegister.fulfilled, (state, action: PayloadAction<CashRegister>) => {
      (state.loading = false), (state.cashRegister = action.payload);
    });

    builder.addCase(closeCashRegister.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al cerrar la caja');
    });

    // 15. === Registrar transaccion ===
    builder.addCase(registerTransaction.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(registerTransaction.fulfilled, (state, action: PayloadAction<CashRegister>) => {
      state.loading = false;
      state.cashRegister = action.payload;
    });

    builder.addCase(registerTransaction.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al registrar la transaccion');
    });

    // 16. === Cerrar todas las cajas ===
    builder.addCase(closeAllCashRegisters.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(closeAllCashRegisters.fulfilled, (state) => {
      state.loading = false;
      state.cashRegisters = state.cashRegisters.filter((c) => c.estado === 'cerrada');
    });

    builder.addCase(closeAllCashRegisters.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al cerrar todas las cajas');
    });

    // 17. === Eliminar una caja ===
    builder.addCase(deleteCashRegister.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteCashRegister.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.cashRegisters = state.cashRegisters.filter((c) => c._id !== deletedId);
    });

    builder.addCase(deleteCashRegister.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al eliminar la cajas');
    });

    // 18. === Eliminar todas las cajas ===
    builder.addCase(deleteAllCashRegisters.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllCashRegisters.fulfilled, (state) => {
      (state.loading = false), (state.cashRegisters = []);
    });

    builder.addCase(deleteAllCashRegisters.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al eliminar todas las cajas');
    });
  },
});

export const { clearSelectedCashRegister, clearCashRegisterError } = cashRegistersSlice.actions;
export default cashRegistersSlice.reducer;
