import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import { Login } from './features/auth/pages/Login';
import { RecoverPassword } from './features/auth/pages/RecoverPassword';
import { ValidateCode } from './features/auth/pages/ValidateCode';
import { ChangePassword } from './features/auth/pages/ChangePassword';

import { Dashboard } from './components/Dashboard/Dashboard';
import { Users } from './features/users/pages/Users';
import { User } from './features/users/pages/User';
import { CreateUser } from './features/users/pages/CreateUser';
import { EditUser } from './features/users/pages/EditUser';
import { UserProfile } from './features/users/user/pages/UserProfile';
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
import { Inventory } from './features/products/inventory/pages/Inventory';
import Sales from './features/sales/pages/Sales';
import { CreateSale } from './features/sales/pages/CreateSale';
import Payments from './features/payments/pages/Payments';
import { Sale } from './features/sales/pages/Sale';
import { Payment } from './features/payments/pages/Payment';

const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      { path: '/auth/login', element: <Login /> },
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
          { path: '/users/:userId', element: <User /> },
          { path: '/users/edit/:userId', element: <EditUser /> },

          { path: '/user/profile', element: <UserProfile /> },
          { path: '/user/settings', element: <UserSettings /> },

          { path: '/customers', element: <Customers /> },
          { path: '/customers/create', element: <CreateCustomer  /> },
          { path: '/customers/:customerId', element: <Customer /> },
          { path: '/customers/edit/:customerId', element: <EditCustomer /> },

          { path: '/products', element: <Products /> },
          { path: '/products/create', element: <CreateProduct /> },
          { path: '/products/:productId', element: <Product /> },
          { path: '/products/edit/:productId', element: <EditProduct /> },

          { path: '/products/categories', element: <Categories /> },
          { path: '/products/categories/create', element: <CreateCategory /> },
          { path: '/products/categories/:categoryId', element: <Category /> },
          { path: '/products/categories/edit/:categoryId', element: <EditCategory /> },

          { path: '/products/providers', element: <Providers /> },
          { path: '/products/providers/create', element: <CreateProvider /> },
          { path: '/products/providers/:providerId', element: <Provider /> },
          { path: '/products/providers/edit/:providerId', element: <EditProvider /> },

          { path: '/products/inventory', element: <Inventory /> },

          { path: '/sales', element: <Sales /> },
          { path: '/sales/create', element: <CreateSale /> },
          { path: 'sales/:codigo', element: <Sale /> },

          { path: '/payments', element: <Payments /> },
          { path: '/payments/:paymentId', element: <Payment /> },

          { path: '/notifications', element: <Notifications /> },

          { path: '/forbidden', element: <Forbidden /> },

          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
