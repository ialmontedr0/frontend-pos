import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hooks';

export function PublicRoute() {
  const accessToken = useAppSelector((state) => state.auth.accessToken); /* :contentReference[oaicite:5] */

  return accessToken ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
