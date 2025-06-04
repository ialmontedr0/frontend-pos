import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hooks';

export function PrivateRoute() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
