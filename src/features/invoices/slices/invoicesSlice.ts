import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Invoice } from '../interfaces/InvoiceInterface';
import { invoicesService } from '../services/invoicesService';
import type { RootState } from '../../../store/store';
import type { InvoiceType } from '../types/invoice-type';

interface InvoicesState {
  invoice: Invoice | null;
  invoices: Invoice[] | [];
  loading: boolean;
  error: string | null;
  currentPdfUrl: string | null;
  previewPdfUrl: string | null;
  lastGenerated?: Invoice;
}

const initialState: InvoicesState = {
  invoices: [],
  invoice: null,
  loading: false,
  error: null,
  currentPdfUrl: null,
  previewPdfUrl: null,
  lastGenerated: undefined,
};

// THUNKS
export const getAllInvoices = createAsyncThunk<Invoice[], void, { rejectValue: string }>(
  'invoices/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const invoicesResponse = await invoicesService.getAllInvoices();
      return invoicesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllInvoicesForCurrentUser = createAsyncThunk<
  Invoice[],
  void,
  { rejectValue: string }
>('invoices/getAllForCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const invoicesResponse = await invoicesService.getAllForCurrentUser();
    return invoicesResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const getInvoiceById = createAsyncThunk<Invoice, string, { rejectValue: string }>(
  'invoices/getByCode',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const invoiceResponse = await invoicesService.getById(invoiceId);
      return invoiceResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.response);
    }
  }
);

export const getInvoiceByCode = createAsyncThunk<Invoice, string, { rejectValue: string }>(
  'invoices/getById',
  async (codigo, { rejectWithValue }) => {
    try {
      const invoiceResponse = await invoicesService.getByCode(codigo);
      return invoiceResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getInvoicesBySale = createAsyncThunk<Invoice[], string, { rejectValue: string }>(
  'invoices/getBySale',
  async (saleId, { rejectWithValue }) => {
    try {
      const invoicesResponse = await invoicesService.getBySale(saleId);
      return invoicesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getInvoicesByUser = createAsyncThunk<Invoice[], string, { rejectValue: string }>(
  'invoices/getByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const invoicesResponse = await invoicesService.getByUser(userId);
      return invoicesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getInvoicesByCustomer = createAsyncThunk<Invoice[], string, { rejectValue: string }>(
  'invoices/getByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const invoicesResponse = await invoicesService.getByCustomer(customerId);
      return invoicesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const generateInvoice = createAsyncThunk<
  Invoice,
  { tipo: InvoiceType; refId: string },
  { rejectValue: string }
>('invoices/generate', async ({ tipo, refId }, { rejectWithValue }) => {
  try {
    const invoiceResponse = await invoicesService.generate({ tipo, refId });
    return invoiceResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const previewInvoice = createAsyncThunk<string, string, { rejectValue: string }>(
  'invoices/preview',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const invoiceResponse = await invoicesService.download(invoiceId);
      const url = URL.createObjectURL(invoiceResponse.data);
      return url;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const downloadInvoice = createAsyncThunk<string, string, { rejectValue: string }>(
  'invoices/download',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const invoiceResponse = await invoicesService.download(invoiceId);
      const url = URL.createObjectURL(
        new Blob([invoiceResponse.data], { type: 'application/pdf' })
      );
      return url;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk<void, string, { rejectValue: string }>(
  'invoices/delete',
  async (invoiceId, { rejectWithValue }) => {
    try {
      await invoicesService.delete(invoiceId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllInvoices = createAsyncThunk<void, void, { rejectValue: string }>(
  'invoices/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await invoicesService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const selectInvoicePdfUrl = (state: RootState) => state.invoices.currentPdfUrl;
export const selectInvoicePreviewUrl = (state: RootState) => state.invoices.previewPdfUrl;

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearPdfUrl(state) {
      if (state.currentPdfUrl) URL.revokeObjectURL(state.currentPdfUrl);
      state.currentPdfUrl = null;
    },
    clearPreviewUrl(state) {
      if (state.previewPdfUrl) URL.revokeObjectURL(state.previewPdfUrl);
      state.previewPdfUrl = null;
    },
    clearLastGenerated(state) {
      state.lastGenerated = undefined;
    },
  },
  extraReducers: (builder) => {
    // 1. Obtener todas las facturas del sistema
    builder.addCase(getAllInvoices.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllInvoices.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
      (state.loading = false), (state.invoices = action.payload);
    });

    builder.addCase(getAllInvoices.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener todas las facturas');
    });

    // 2. Obtener todas las facturas generadas por el usuario actual
    builder.addCase(getAllInvoicesForCurrentUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getAllInvoicesForCurrentUser.fulfilled,
      (state, action: PayloadAction<Invoice[]>) => {
        (state.loading = false), (state.invoices = action.payload);
      }
    );

    builder.addCase(getAllInvoicesForCurrentUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error =
          (action.payload as string) || 'Error al obtener todas las facturas del usuario actual');
    });

    // 3. Obtener factura por su ID
    builder.addCase(getInvoiceById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getInvoiceById.fulfilled, (state, action: PayloadAction<Invoice>) => {
      (state.loading = false), (state.invoice = action.payload);
    });

    builder.addCase(getInvoiceById.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la factura por su ID');
    });

    // 4. Obtener factura por su Codigo
    builder.addCase(getInvoiceByCode.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getInvoiceByCode.fulfilled, (state, action: PayloadAction<Invoice>) => {
      (state.loading = false), (state.invoice = action.payload);
    });

    builder.addCase(getInvoiceByCode.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la factura por su Codigo');
    });

    // 5. Obtener facturas de una Venta
    builder.addCase(getInvoicesBySale.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getInvoicesBySale.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
      (state.loading = false), (state.invoices = action.payload);
    });

    builder.addCase(getInvoicesBySale.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las factuas de la ventaF');
    });

    // 6. Obtener facturas de un Usuario
    builder.addCase(getInvoicesByUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getInvoicesByUser.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
      (state.loading = false), (state.invoices = action.payload);
    });

    builder.addCase(getInvoicesByUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las facturas del usuario');
    });

    // 7. Obtener facturas de un cliente
    builder.addCase(getInvoicesByCustomer.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getInvoicesByCustomer.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
      (state.loading = false), (state.invoices = action.payload);
    });

    builder.addCase(getInvoicesByCustomer.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las facturas del cliente');
    });

    // 8. Generar una factura
    builder.addCase(generateInvoice.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(generateInvoice.fulfilled, (state, action: PayloadAction<Invoice>) => {
      (state.loading = false), (state.lastGenerated = action.payload);
    });

    builder.addCase(generateInvoice.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al generar la factura');
    });

    builder.addCase(previewInvoice.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(previewInvoice.fulfilled, (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.previewPdfUrl = action.payload);
    });

    builder.addCase(previewInvoice.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al visualizar la factura');
    });

    // 9. Descargar una factura
    builder.addCase(downloadInvoice.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(downloadInvoice.fulfilled, (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.currentPdfUrl = action.payload);
    });

    builder.addCase(downloadInvoice.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al descargar la factura');
    });

    // 10. Eliminar una factura
    builder.addCase(deleteInvoice.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteInvoice.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.invoices.filter((invoice) => invoice._id !== deletedId);
    });

    builder.addCase(deleteInvoice.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al eliminar la factura');
    });

    // 11. Eliminar todas las facturas
    builder.addCase(deleteAllInvoices.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllInvoices.fulfilled, (state) => {
      (state.loading = false), (state.invoices = []);
    });

    builder.addCase(deleteAllInvoices.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al eliminar todas las facturas');
    });
  },
});

export const { clearPdfUrl, clearPreviewUrl, clearLastGenerated } = invoicesSlice.actions;
export default invoicesSlice.reducer;
