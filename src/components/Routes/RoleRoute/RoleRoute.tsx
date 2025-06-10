import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

interface RoleRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
}

/**
 * RoleRoute:
 * - Comprueba isAuthenticated + rol en allowedRoles
 * - Si pasa, renderiza children (via <Outlet />)
 * - Si no, redirige a login o a 403
 */

export const RoleRoute: React.FC<RoleRouteProps> = ({
  allowedRoles,
  redirectPath = '/dashboard',
}) => {
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // No autenticado -> login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!user || !allowedRoles.includes(user.rol)) {
    // Autenticado pero rol no permitodo, Forbidden o redirectPath
    return <Navigate to={redirectPath} replace />;
  }

  // Paso ambas comprobaciones
  return <Outlet />;
};
