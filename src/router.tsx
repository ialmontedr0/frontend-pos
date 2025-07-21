import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom';
import { lazy } from 'react';

// Auth Routes
import { AppLayout } from './layouts/AppLayout';
import { RecoverPassword } from './features/auth/pages/RecoverPasswordPage';
import { ValidateCode } from './features/auth/pages/ValidateCodePage';
import { ChangePassword } from './features/auth/pages/ChangePasswordPage';

// Common Load Routes
import { Dashboard } from './pages/Dashboard/Dashboard';
import { User } from './features/users/pages/User';
import { CreateUser } from './features/users/pages/CreateUser';
import { Customer } from './features/customers/pages/Customer';
import { CreateCustomer } from './features/customers/pages/CreateCustomer';
import { Product } from './features/products/pages/Product';
import { CreateProduct } from './features/products/pages/CreateProduct';
import { Category } from './features/products/categories/pages/Category';
import { CreateCategory } from './features/products/categories/pages/CreateCategory';
import { Provider } from './features/products/providers/pages/Provider';
import { CreateProvider } from './features/products/providers/pages/CreateProvider';
import { Forbidden } from './pages/Forbidden';
import { NotFound } from './pages/NotFound';
import { PublicRoute } from './components/Routes/PublicRoute/PublicRoute';
import { PrivateRoute } from './components/Routes/ProtectedRoute/ProtectedRoute';
import { RecoverGuard } from './features/auth/guards/RecoverGuard';
import { ValidateGuard } from './features/auth/guards/ValidateGuard';
import { ChangeGuard } from './features/auth/guards/ChangeGuard';
import { InventoryPage } from './features/products/inventory/pages/InventoryPage';
import { Sale } from './features/sales/pages/Sale';
import { Payment } from './features/payments/pages/Payment';
import { CreatePayment } from './features/payments/pages/CreatePayment';
import { CashRegister } from './features/cash-registers/pages/CashRegister';
import { CreateRegister } from './features/cash-registers/pages/CreateRegister';
import { LogInPage } from './features/auth/pages/LogInPage';
import { Transaction } from './features/cash-registers/transactions/pages/Transaction';
import { SyncLogs } from './features/sync-logs/pages/SyncLogs';
import { SalePage } from './features/sales/pages/NewSalePage';
import { SettingsPage } from './features/users/user/pages/SettingsPage';
import { SyncLog } from './features/sync-logs/pages/SyncLog';
import { UserProfilePage } from './features/users/user/pages/UserProfilePage';
import { Store } from './features/stores/pages/Store';
import { CreateStore } from './features/stores/pages/CreateStore';

// Lazy Loading Routes
const Users = lazy(() => import('./features/users/pages/Users'));
const Customers = lazy(() => import('./features/customers/pages/Customers'));
const Sales = lazy(() => import('./features/sales/pages/Sales'));
const Transactions = lazy(
  () => import('./features/cash-registers/transactions/pages/Transactions')
);
const CashRegisters = lazy(() => import('./features/cash-registers/pages/CashRegisters'));
const Payments = lazy(() => import('./features/payments/pages/Payments'));
const Notifications = lazy(() => import('./features/notifications/pages/Notifications'));
const Providers = lazy(() => import('./features/products/providers/pages/Providers'));
const Categories = lazy(() => import('./features/products/categories/pages/Categories'));
const Products = lazy(() => import('./features/products/pages/Products'));
const Invoices = lazy(() => import('./features/invoices/pages/Invoices'));
const Stores = lazy(() => import('./features/stores/pages/Stores'));

const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      { path: '/auth/login', element: <LogInPage /> },
      {
        path: '/auth/recover-password',
        element: (
          <RecoverGuard>
            <RecoverPassword />
          </RecoverGuard>
        ),
      },
      {
        path: '/auth/validate-code',
        element: (
          <ValidateGuard>
            <ValidateCode />
          </ValidateGuard>
        ),
      },
      {
        path: '/auth/change-password',
        element: (
          <ChangeGuard>
            <ChangePassword />
          </ChangeGuard>
        ),
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <Dashboard /> },

          { path: '/users', element: <Users /> },
          { path: '/users/create', element: <CreateUser /> },
          { path: '/users/:usuario', element: <User /> },

          { path: '/user/profile', element: <UserProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },

          { path: '/customers', element: <Customers /> },
          { path: '/customers/create', element: <CreateCustomer /> },
          { path: '/customers/:customerId', element: <Customer /> },

          { path: '/products', element: <Products /> },
          { path: '/products/create', element: <CreateProduct /> },
          { path: '/products/:codigo', element: <Product /> },

          { path: '/products/categories', element: <Categories /> },
          { path: '/products/categories/create', element: <CreateCategory /> },
          { path: '/products/categories/:categoryId', element: <Category /> },

          { path: '/products/providers', element: <Providers /> },
          { path: '/products/providers/create', element: <CreateProvider /> },
          { path: '/products/providers/:providerId', element: <Provider /> },

          { path: '/products/inventory', element: <InventoryPage /> },

          { path: '/sales', element: <Sales /> },
          { path: '/sales/create', element: <SalePage /> },
          { path: 'sales/:codigo', element: <Sale /> },

          { path: '/payments', element: <Payments /> },
          { path: '/payments/create', element: <CreatePayment /> },
          { path: '/payments/:paymentId', element: <Payment /> },

          { path: '/cash-registers', element: <CashRegisters /> },
          { path: '/cash-registers/:codigo', element: <CashRegister /> },
          { path: '/cash-registers/create', element: <CreateRegister /> },

          { path: '/stores', element: <Stores /> },
          { path: '/stores/:codigo', element: <Store /> },
          { path: '/stores/create', element: <CreateStore /> },

          { path: '/transactions', element: <Transactions /> },
          { path: '/transactions/:transactionId', element: <Transaction /> },

          { path: '/invoices', element: <Invoices /> },

          { path: '/sync-logs', element: <SyncLogs /> },
          { path: '/sync-logs/:syncLogId', element: <SyncLog /> },

          { path: '/notifications', element: <Notifications /> },

          { path: '/forbidden', element: <Forbidden /> },

          { path: '*', element: <NotFound node="" /> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
