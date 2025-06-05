import { useEffect, useState, type JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAppDispath, useAppSelector } from './hooks/hooks';
import { restoreAuth } from './features/auth/slices/authSlice';

import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ThemeProvider } from './contexts/ThemeContext';

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

const links = [
  { label: 'Inicio', to: '/dashboard' },
  { label: 'Usuarios', to: '/users' },
  { label: 'Clientes', to: '/customers' },
  { label: 'Productos', to: '/products' },
  { label: 'Inventario', to: '/inventory' },
  { label: 'Ventas', to: '/sales' },
  { label: 'Facturas', to: '/invoices' },
  { label: 'Notificaciones', to: '/notifications' },
  { label: 'Sync Logs', to: '/sync-logs' },
  { label: 'Perfil', to: '/user/profile' },
  { label: 'Configuracion', to: '/settings' },
];

function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        {/** Header y sidebar siempre visibles en rutas privadas */}
        <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} links={links} />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
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
    dispatch(restoreAuth());
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
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<User />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/edit/:userId" element={<EditUser />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/settings" element={<UserSettings />} />

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
