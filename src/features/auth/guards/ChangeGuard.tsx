import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

export function ChangeGuard({ children }: { children: JSX.Element }) {
  const isCodeValidated = useAppSelector((state: RootState) => state.auth.isCodeValidated);
  return isCodeValidated ? children : <Navigate to="/auth/validate-code" replace />;
}
