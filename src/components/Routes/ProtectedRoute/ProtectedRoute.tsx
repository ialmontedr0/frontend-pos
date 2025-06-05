import { Navigate, Outlet } from 'react-router-dom'; /* 
import { useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store'; */
import type React from 'react';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
  /* const { accessToken, loading } = useAppSelector((state: RootState) => state.auth);

  if (loading) {
    return <div>Cargando...</div>
  }

  return accessToken ? <Outlet /> : ; */
};
