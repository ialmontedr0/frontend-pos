import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom';

import { AppLayout } from './layouts/AppLayout';
import { RecoverPassword } from './features/auth/pages/RecoverPasswordPage';
import { ValidateCode } from './features/auth/pages/ValidateCodePage';
import { ChangePassword } from './features/auth/pages/ChangePasswordPage';

import { Dashboard } from './pages/Dashboard/Dashboard';
import { Users } from './features/users/pages/Users';
import { User } from './features/users/pages/User';
import { CreateUser } from './features/users/pages/CreateUser';
import { EditUser } from './features/users/pages/EditUser';
import { UserSettings } from './features/users/user/components/Settings/Settings';
import { Customers } from './features/customers/pages/Customers';
import { Customer } from './features/customers/pages/Customer';
import { CreateCustomer } from './features/customers/pages/CreateCustomer';
import { EditCustomer } from './features/customers/pages/EditCustomer';
import { Products } from './features/products/pages/Products';
import { Product } from './features/products/pages/Product';
import { CreateProduct } from './features/products/pages/CreateProduct';
import { EditProduct } from './features/products/pages/EditProduct';
import { Categories } from './features/products/categories/pages/Categories';
import { Category } from './features/products/categories/pages/Category';
import { CreateCategory } from './features/products/categories/pages/CreateCategory';
import { EditCategory } from './features/products/categories/pages/EditCategory';
import { Providers } from './features/products/providers/pages/Providers';
import { Provider } from './features/products/providers/pages/Provider';
import { CreateProvider } from './features/products/providers/pages/CreateProvider';
import { EditProvider } from './features/products/providers/pages/EditProvider';
import { Notifications } from './features/notifications/pages/Notifications';
import { Forbidden } from './pages/Forbidden';
import { NotFound } from './pages/NotFound';
import { PublicRoute } from './components/Routes/PublicRoute/PublicRoute';
import { PrivateRoute } from './components/Routes/ProtectedRoute/ProtectedRoute';
/* import { RoleRoute } from './components/Routes/RoleRoute/RoleRoute'; */

import { RecoverGuard } from './features/auth/guards/RecoverGuard';
import { ValidateGuard } from './features/auth/guards/ValidateGuard';
import { ChangeGuard } from './features/auth/guards/ChangeGuard';
import { InventoryPage } from './features/products/inventory/pages/InventoryPage';
import Sales from './features/sales/pages/Sales';
import Payments from './features/payments/pages/Payments';
import { Sale } from './features/sales/pages/Sale';
import { Payment } from './features/payments/pages/Payment';
import { CreatePayment } from './features/payments/pages/CreatePayment';
import CashRegisters from './features/cash-registers/pages/CashRegisters';
import { CashRegister } from './features/cash-registers/pages/CashRegister';
import { EditRegister } from './features/cash-registers/pages/EditRegister';
import { CreateRegister } from './features/cash-registers/pages/CreateRegister';
import { LogInPage } from './features/auth/pages/LogInPage';
import UserProfilePage from './features/users/user/components/UserProfile/UserProfile';
import { Transaction } from './features/cash-registers/transactions/pages/Transaction';
import Transactions from './features/cash-registers/transactions/pages/Transactions';
import { SyncLogs } from './features/sync-logs/pages/SyncLogs';
import { SalePage } from './features/sales/components/NewSale/NewSale';
import { SettingsPage } from './features/users/user/pages/SettingsPage';
import { SyncLog } from './features/sync-logs/pages/SyncLog';
import InvoicesPage from './features/invoices/pages/InvoicesPage';

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
          { path: '/users/edit/:userId', element: <EditUser /> },

          { path: '/user/profile', element: <UserProfilePage /> },
          { path: '/user/settings', element: <UserSettings /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/customers', element: <Customers /> },
          { path: '/customers/create', element: <CreateCustomer /> },
          { path: '/customers/:customerId', element: <Customer /> },
          { path: '/customers/edit/:customerId', element: <EditCustomer /> },

          { path: '/products', element: <Products /> },
          { path: '/products/create', element: <CreateProduct /> },
          { path: '/products/:codigo', element: <Product /> },
          { path: '/products/edit/:codigo', element: <EditProduct /> },

          { path: '/products/categories', element: <Categories /> },
          { path: '/products/categories/create', element: <CreateCategory /> },
          { path: '/products/categories/:categoryId', element: <Category /> },
          { path: '/products/categories/edit/:categoryId', element: <EditCategory /> },

          { path: '/products/providers', element: <Providers /> },
          { path: '/products/providers/create', element: <CreateProvider /> },
          { path: '/products/providers/:providerId', element: <Provider /> },
          { path: '/products/providers/edit/:providerId', element: <EditProvider /> },

          { path: '/products/inventory', element: <InventoryPage /> },

          { path: '/sales', element: <Sales /> },
          { path: '/sales/create', element: <SalePage /> },
          { path: 'sales/:codigo', element: <Sale /> },

          { path: '/payments', element: <Payments /> },
          { path: '/payments/create', element: <CreatePayment /> },
          { path: '/payments/:paymentId', element: <Payment /> },

          { path: '/cash-registers', element: <CashRegisters /> },
          { path: '/cash-registers/:codigo', element: <CashRegister /> },
          { path: '/cash-registers/edit/:codigo', element: <EditRegister /> },
          { path: '/cash-registers/create', element: <CreateRegister /> },

          { path: '/transactions', element: <Transactions /> },
          { path: '/transactions/:transactionId', element: <Transaction /> },

          { path: '/invoices', element: <InvoicesPage /> },

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
