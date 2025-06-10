import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../interfaces/ProductInterface';
import type { CreateProductDTO } from '../dtos/create-product.dto';
import type { UpdateProductDTO } from '../dtos/update-product.dto';
import type { UpdateProductPriceBuyDTO } from '../dtos/update-product-price-buy.dto';
import type { UpdateProductPriceSaleDTO } from '../dtos/update-product-price-sale.dto';
import { productsService } from '../services/productsService';

interface ProductState {
  product: Product | null;
  products: Product[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  products: [],
  loading: false,
  error: null,
};

export const getAllProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const productsResponse = await productsService.getAll();
      return productsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'products/getById',
  async (productId, { rejectWithValue }) => {
    try {
      const productResponse = await productsService.getById(productId);
      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProductByCode = createAsyncThunk<Product, string, { rejectValue: string }>(
  'products/getByCode',
  async (codigo, { rejectWithValue }) => {
    try {
      const productResponse = await productsService.getByCode(codigo);
      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProduct = createAsyncThunk<Product, CreateProductDTO, { rejectValue: string }>(
  'products/create',
  async (createProductDTO, { rejectWithValue }) => {
    try {
      const productResponse = await productsService.create(createProductDTO);
      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { productId: string; updateProductDTO: UpdateProductDTO },
  { rejectValue: string }
>('products/update', async ({ productId, updateProductDTO }, { rejectWithValue }) => {
  try {
    const productReponse = await productsService.update(productId, updateProductDTO);
    return productReponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProductPriceBuy = createAsyncThunk<
  Product,
  { productId: string; updateProductPriceBuyDTO: UpdateProductPriceBuyDTO },
  { rejectValue: string }
>(
  'products/updatePriceBuy',
  async ({ productId, updateProductPriceBuyDTO }, { rejectWithValue }) => {
    try {
      const productResponse = await productsService.updatePriceBuy(
        productId,
        updateProductPriceBuyDTO
      );
      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProductPriceSale = createAsyncThunk<
  Product,
  { productId: string; updateProductPriceSaleDTO: UpdateProductPriceSaleDTO },
  { rejectValue: string }
>(
  'products/updatePriceSale',
  async ({ productId, updateProductPriceSaleDTO }, { rejectWithValue }) => {
    try {
      const productResponse = await productsService.updatePriceSale(
        productId,
        updateProductPriceSaleDTO
      );
      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk<void, string, { rejectValue: string }>(
  'products/delete',
  async (productId, { rejectWithValue }) => {
    try {
      await productsService.delete(productId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllProducts = createAsyncThunk<void, void, { rejectValue: string }>(
  'products/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await productsService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError(state) {
      state.error = null;
    },
    clearSelectedProduct(state) {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    // === Obtener todos los productos ===
    builder.addCase(getAllProducts.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      (state.loading = false), (state.products = action.payload);
    });

    builder.addCase(getAllProducts.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener todos los productos');
    });

    // === Obtener producto por su ID
    builder.addCase(getProductById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getProductById.fulfilled, (state, action: PayloadAction<Product>) => {
      (state.loading = false), (state.product = action.payload);
    });

    builder.addCase(getProductById.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener el producto');
    });

    // === Obtener producto por su codigo
    builder.addCase(getProductByCode.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getProductByCode.fulfilled, (state, action: PayloadAction<Product>) => {
      (state.loading = false), (state.product = action.payload);
    });

    builder.addCase(getProductByCode.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener el producto');
    });

    // === Crear producto
    builder.addCase(createProduct.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      (state.loading = false), (state.product = action.payload);
    });

    builder.addCase(createProduct.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error creando el producto');
    });

    // === Actualizar producto
    builder.addCase(updateProduct.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      (state.loading = false), (state.product = action.payload);
      const idx = state.products.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
    });

    builder.addCase(updateProduct.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al actualizar el producto');
    });

    // === Actualizar precio compra de producto
    builder.addCase(updateProductPriceBuy.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateProductPriceBuy.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      state.product = action.payload;
      const idx = state.products.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
    });

    builder.addCase(updateProductPriceBuy.rejected, (state, action) => {
      (state.loading = false),
        (state.error =
          (action.payload as string) || 'Error al actualizar el precio de compra del producto');
    });

    // === Actualizar precio venta de producto
    builder.addCase(updateProductPriceSale.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateProductPriceSale.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      state.product = action.payload;
      const idx = state.products.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
    });

    builder.addCase(updateProductPriceSale.rejected, (state, action) => {
      (state.loading = false),
        (state.error =
          (action.payload as string) || 'Error actualizando el precio de venta del producto');
    });

    // === Eliminar producto
    builder.addCase(deleteProduct.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.products = state.products.filter((p) => p._id !== deletedId);
    });

    builder.addCase(deleteProduct.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando el producto');
    });

    // === Eliminar todos los productos
    builder.addCase(deleteAllProducts.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllProducts.fulfilled, (state) => {
      (state.loading = false), (state.products = []);
    });

    builder.addCase(deleteAllProducts.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando todos los productos');
    });
  },
});

export const { clearProductError, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
