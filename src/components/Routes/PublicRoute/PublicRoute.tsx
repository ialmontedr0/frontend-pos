import { Navigate, Outlet } from 'react-router-dom';
/* import { useAppSelector } from '../../../hooks/hooks';
 */import type React from 'react';

interface PublicRouteProps {
  isAuthenticated: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;

  /* const accessToken = useAppSelector((state) => state.auth.accessToken); 

  return accessToken ? <Navigate to="/dashboard" replace /> : <Outlet />; */
};
