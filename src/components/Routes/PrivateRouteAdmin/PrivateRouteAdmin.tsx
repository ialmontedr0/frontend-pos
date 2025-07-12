import type { JSX } from 'react';
import { useAppSelector } from '../../../hooks/hooks';
import { Navigate } from 'react-router-dom';

export default function PrivateAdmin({ children }: { children: JSX.Element }) {
  const { user } = useAppSelector((state) => state.auth);
  if (!user || user.rol !== 'admin') return <Navigate to="/" />;
  return children;
}
