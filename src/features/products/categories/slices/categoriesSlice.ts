import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../interfaces/CategoryInterface';
import type { CreateCategoryDTO } from '../dtos/create-category.dto';
import type { UpdateCategoryDTO } from '../dtos/update-category.dto';
import { categoriesService } from '../services/categoriesService';

interface CategoryState {
  category: Category | null;
  categories: Category[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  category: null,
  categories: [],
  loading: false,
  error: null,
};

export const getAllCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const categoriesResponse = await categoriesService.getAll();
      return categoriesResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getCategoryById = createAsyncThunk<Category, string, { rejectValue: string }>(
  'categories/getById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const categoryResponse = await categoriesService.getById(categoryId);
      return categoryResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCategory = createAsyncThunk<
  Category,
  CreateCategoryDTO,
  { rejectValue: string }
>('categories/create', async (createCategoryDTO, { rejectWithValue }) => {
  try {
    const categoryResponse = await categoriesService.create(createCategoryDTO);
    return categoryResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  { categoryId: string; updateCategoryDTO: UpdateCategoryDTO },
  { rejectValue: string }
>('categories/update', async ({ categoryId, updateCategoryDTO }, { rejectWithValue }) => {
  try {
    const categoryResponse = await categoriesService.update(categoryId, updateCategoryDTO);
    return categoryResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteCategory = createAsyncThunk<void, string, { rejectValue: string }>(
  'categories/delete',
  async (categoryId, { rejectWithValue }) => {
    try {
      await categoriesService.delete(categoryId);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllCategories = createAsyncThunk<void, void, { rejectValue: string }>(
  'categories/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await categoriesService.deleteAll();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
    clearSelectedCategory(state) {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    // === Obtener todas las categorias ===
    builder.addCase(getAllCategories.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getAllCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
      (state.loading = false), (state.categories = action.payload);
    });

    builder.addCase(getAllCategories.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener las categorias');
    });

    // === Obtener una categoria por su ID ===
    builder.addCase(getCategoryById.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
      (state.loading = false), (state.category = action.payload);
    });

    builder.addCase(getCategoryById.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al obtener la categoria');
    });

    // === Crear una categoria ===
    builder.addCase(createCategory.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
      (state.loading = false), (state.category = action.payload);
    });

    builder.addCase(createCategory.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al crear la categoria');
    });

    // === Actualizar una categoria ===
    builder.addCase(updateCategory.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
      (state.loading = false), (state.category = action.payload);
      const idx = state.categories.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) {
        state.categories[idx] = action.payload;
      }
    });

    builder.addCase(updateCategory.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error actualizando la categoria');
    });

    // === Eliminar una categoria ===
    builder.addCase(deleteCategory.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      state.categories = state.categories.filter((c) => c._id !== deletedId);
    });

    builder.addCase(deleteCategory.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando la categoria');
    });

    // === Eliminar todas las categorias ===
    builder.addCase(deleteAllCategories.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllCategories.fulfilled, (state) => {
      (state.loading = false), (state.categories = []);
    });

    builder.addCase(deleteAllCategories.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error eliminando todas las categorias');
    });
  },
});

export const { clearCategoryError, clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
