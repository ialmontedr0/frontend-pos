import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Importar los slices
import authReducer from '../features/auth/slices/authSlice';
import usersReducer from '../features/users/slices/usersSlice';
import customersReducer from '../features/customers/slices/customerSlice';
import notificationsReducer from '../features/notifications/slices/notificationsSlice';
import categoriesReducer from '../features/products/categories/slices/categoriesSlice';
import providersReducer from '../features/products/providers/slices/providersSlice';
import productsReducer from '../features/products/slices/productsSlice';
import salesReducer from '../features/sales/slices/salesSlice';
import paymentsReducer from '../features/payments/slices/paymentsSlices';
import cashRegistersReducer from '../features/cash-registers/slices/cashRegisterSlice';
import inventoryReducer from '../features/products/inventory/slices/inventorySlice';
import transactionReducer from '../features/cash-registers/transactions/slices/transactionsSlice';
import invoicesReducer from '../features/invoices/slices/invoicesSlice';
import settingsReducer from '../features/settings/slices/settingsSlice';
import offlineReducer from '../features/offline/slices/offlineSlice';
import branchesReducer from '../features/branches/slices/branchesSlice';
import { offlineMiddleware } from '../features/offline/middlewares/offlineMiddleware';
import { setupOfflineSync } from '../features/offline/sync/offlineSync';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'users'],
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Auth',
    'User',
    'Customer',
    'Product',
    'Category',
    'Inventory',
    'Sale',
    'Payment',
    'CashRegister',
    'Invoice',
    'Notification',
    'Transaction',
    'Branche',
    'Stats',
    'Settings',
  ],
  endpoints: () => ({
    // ex getUsers: builder.query<User[], void>({ query: () => '/users' })
  }),
});

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  customers: customersReducer,
  categories: categoriesReducer,
  providers: providersReducer,
  products: productsReducer,
  sales: salesReducer,
  payments: paymentsReducer,
  cashRegisters: cashRegistersReducer,
  inventory: inventoryReducer,
  transactions: transactionReducer,
  invoices: invoicesReducer,
  notifications: notificationsReducer,
  settings: settingsReducer,
  offline: offlineReducer,
  branches: branchesReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(api.middleware)
      .concat(offlineMiddleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
setupOfflineSync();

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
