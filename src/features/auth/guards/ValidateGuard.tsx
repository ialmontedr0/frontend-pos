import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

export function ValidateGuard({ children }: { children: JSX.Element }) {
  const { isUserValidated, isCodeValidated } = useAppSelector((state: RootState) => state.auth);
  if (!isUserValidated) return <Navigate to="/auth/recover-password" replace />;
  if (isCodeValidated) return <Navigate to="/auth/change-password" replace />;
  return children;
}
