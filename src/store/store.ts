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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
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
  tagTypes: ['Auth', 'User', 'Customer', 'Product', 'Category', 'Sale', 'Invoice', 'Notification'],
  endpoints: () => ({
    // ex getUsers: builder.query<User[], void>({ query: () => '/users' })
  }),
});

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  customers: customersReducer,
  categories: categoriesReducer,
  notifications: notificationsReducer,
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
    }).concat(api.middleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
