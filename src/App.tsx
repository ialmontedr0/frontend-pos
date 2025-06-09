import { useEffect, useState, type JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAppDispath, useAppSelector } from './hooks/hooks';
import { restoreAuth } from './features/auth/slices/authSlice';

import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';

import { PublicRoute } from './components/Routes/PublicRoute/PublicRoute';
import { PrivateRoute } from './components/Routes/ProtectedRoute/ProtectedRoute';

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
import { Notifications } from './features/notifications/pages/Notifications';
import { getNotificationsForCurrentUser } from './features/notifications/slices/notificationsSlice';

import { Customers } from './features/customers/pages/Customers';
import { CreateCustomer } from './features/customers/pages/CreateCustomer';
import { Customer } from './features/customers/pages/Customer';
import { EditCustomer } from './features/customers/pages/EditCustomer';
import { Categories } from './features/products/categories/pages/Categories';
import { Category } from './features/products/categories/pages/Category';
import { CreateCategory } from './features/products/categories/pages/CreateCategory';
import { EditCategory } from './features/products/categories/pages/EditCategory';
import { Products } from './features/products/pages/Products';

function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col h-screen">
      {/** Header y sidebar siempre visibles en rutas privadas */}
      <header className="shrink-0">
        <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 bg-white dark:bg-[#1d293d]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Guardian para el RecoverPassword
function RecoverGuard({ children }: { children: JSX.Element }) {
  const isUserValidated = useAppSelector((state) => state.auth.isUserValidated);
  return isUserValidated ? <Navigate to="/auth/validate-code" replace /> : children;
}

function ValidateGuard({ children }: { children: JSX.Element }) {
  const { isUserValidated, isCodeValidated } = useAppSelector((state) => state.auth);
  if (!isUserValidated) return <Navigate to="/auth/recover-password" replace />;
  if (isCodeValidated) return <Navigate to="/auth/change-password" replace />;
  return children;
}

function ChangeGuard({ children }: { children: JSX.Element }) {
  const isCodeValidated = useAppSelector((state) => state.auth.isCodeValidated);
  return isCodeValidated ? children : <Navigate to="/auth/validate-code" replace />;
}

export function App() {
  const dispatch = useAppDispath();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreAuth()).then((action) => {
      if (restoreAuth.fulfilled.match(action)) {
        dispatch(getNotificationsForCurrentUser());
      }
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/** Rutas publicas */}
        <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/auth/login" element={<Login />} />

          <Route
            path="/auth/recover-password"
            element={
              <RecoverGuard>
                <RecoverPassword />
              </RecoverGuard>
            }
          />

          <Route
            path="/auth/validate-code"
            element={
              <ValidateGuard>
                <ValidateCode />
              </ValidateGuard>
            }
          />
          <Route
            path="/auth/change-password"
            element={
              <ChangeGuard>
                <ChangePassword />
              </ChangeGuard>
            }
          />
        </Route>

        {/** Rutas privadas */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          {/** ProtectedLayout como padre */}
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/** Usuarios */}
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<User />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/edit/:userId" element={<EditUser />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/settings" element={<UserSettings />} />

            {/** Clientes */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/create" element={<CreateCustomer />} />
            <Route path="/customers/:customerId" element={<Customer />} />
            <Route path="/customers/edit/:customerId" element={<EditCustomer />} />

            {/** Productos */}
            <Route path="/products" element={<Products />} />

            {/** Products:Categorias */}
            <Route path="/products/categories" element={<Categories />} />
            <Route path="/products/categories/:categoryId" element={<Category />} />
            <Route path="/products/categories/create" element={<CreateCategory />} />
            <Route path="/products/categories/edit/:categoryId" element={<EditCategory />} />

            {/** Notificaciones */}
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="*"
              element={<p className="p-6 text-black dark:text-white">Pagina no existe 404 :(</p>}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
