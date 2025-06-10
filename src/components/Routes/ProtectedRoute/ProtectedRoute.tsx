import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

export const PrivateRoute = () => {
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};
