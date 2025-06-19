import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../interfaces/ProductInterface';
import { inventoryService } from '../services/inventoryService';
import type { UpdateProductStockDTO } from '../dtos/update-product-stock.dto';
import type { IncreaseProductStockDTO } from '../dtos/increate-product-stock.dto';
import type { DecreaseProductStockDTO } from '../dtos/decrease-product-stock.dto';

interface InventoryState {
  product: Product | null;
  products: Product[] | [];
  updateLoading: boolean;
  increaseLoading: boolean;
  decreaseLoading: boolean;
  lowStock: Product[];
  recent: Product[];
  topSold: Product[];
  leastSold: Product[];
  loading: boolean;
  error?: string | null;
}

const initialState: InventoryState = {
  product: null,
  products: [],
  updateLoading: false,
  increaseLoading: false,
  decreaseLoading: false,
  lowStock: [],
  recent: [],
  topSold: [],
  leastSold: [],
  loading: false,
  error: null,
};

export const updateProductStock = createAsyncThunk<
  Product,
  { productId: string; updateProductStockDTO: UpdateProductStockDTO },
  { rejectValue: string }
>(
  'inventory/updateProductStock',
  async ({ productId, updateProductStockDTO }, { rejectWithValue }) => {
    try {
      const productResponse = await inventoryService.updateStock(productId, updateProductStockDTO);
      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const increaseProductStock = createAsyncThunk<
  Product,
  { productId: string; increaseProductStockDTO: IncreaseProductStockDTO },
  { rejectValue: string }
>(
  'inventory/increaseProductStock',
  async ({ productId, increaseProductStockDTO }, { rejectWithValue }) => {
    try {
      const productResponse = await inventoryService.increaseStock(
        productId,
        increaseProductStockDTO
      );
      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const decreaseProductStock = createAsyncThunk<
  Product,
  { productId: string; decreaseProductStockDTO: DecreaseProductStockDTO },
  { rejectValue: string }
>(
  'inventory/decreaseProductStock',
  async ({ productId, decreaseProductStockDTO }, { rejectWithValue }) => {
    try {
      const productResponse = await inventoryService.decreaseStock(
        productId,
        decreaseProductStockDTO
      );
      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [low, recent, top, least] = await Promise.all([
        inventoryService.getLowStock(),
        inventoryService.getRecent(),
        inventoryService.getTopSold(),
        inventoryService.getLeastSold(),
      ]);

      return {
        low: low.data,
        recent: recent.data,
        top: top.data,
        least: least.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventory(state) {
      (state.lowStock = []), (state.recent = []), (state.topSold = []), (state.leastSold = []);
    },
    clearInventoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInventory.pending, (state) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(fetchInventory.fulfilled, (state, action) => {
      (state.loading = false),
        (state.lowStock = action.payload.low),
        (state.recent = action.payload.recent),
        (state.topSold = action.payload.top),
        (state.leastSold = action.payload.least);
    });
    builder.addCase(fetchInventory.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error obteniendo el stock');
    });
    // === Actualizar stock ===
    builder.addCase(updateProductStock.pending, (state) => {
      (state.updateLoading = true), (state.error = null);
    });

    builder.addCase(updateProductStock.fulfilled, (state, action: PayloadAction<Product>) => {
      (state.updateLoading = false), (state.product = action.payload);
      const idx = state.products.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
    });

    builder.addCase(updateProductStock.rejected, (state, action) => {
      (state.updateLoading = false),
        (state.error = (action.payload as string) || 'Error actualizando el stock del producto');
    });

    // === Incrementar stock ===
    builder.addCase(increaseProductStock.pending, (state) => {
      (state.increaseLoading = true), (state.error = null);
    });

    builder.addCase(increaseProductStock.fulfilled, (state, action: PayloadAction<Product>) => {
      (state.increaseLoading = false), (state.product = action.payload);
      const idx = state.products.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
    });

    builder.addCase(increaseProductStock.rejected, (state, action) => {
      (state.increaseLoading = false),
        (state.error = (action.payload as string) || 'Error incrementando el stock del producto');
    });

    // === Reducir stock ===
    builder.addCase(decreaseProductStock.pending, (state) => {
      (state.decreaseLoading = true), (state.error = null);
    });

    builder.addCase(decreaseProductStock.fulfilled, (state, action: PayloadAction<Product>) => {
      (state.decreaseLoading = false), (state.product = action.payload);
      const idx = state.products.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
    });

    builder.addCase(decreaseProductStock.rejected, (state, action) => {
      (state.decreaseLoading = false),
        (state.error = (action.payload as string) || 'Error reduciendo el stock del producto');
    });
  },
});

export const { clearInventory, clearInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;
