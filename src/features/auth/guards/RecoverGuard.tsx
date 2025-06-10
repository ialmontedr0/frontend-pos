import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

// Guardian para el RecoverPassword
export function RecoverGuard({ children }: { children: JSX.Element }) {
  const isUserValidated = useAppSelector((state: RootState) => state.auth.isUserValidated);
  return isUserValidated ? <Navigate to="/auth/validate-code" replace /> : children;
}
