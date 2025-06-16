import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { useFetchByRole } from '../hooks/useFetchByRole';
import type { AsyncThunk } from '@reduxjs/toolkit';
import { selectUserRole } from '../features/auth/slices/authSlice';

// Cualquier AsyncThunk
type AnyAsyncThunk<T> = AsyncThunk<T, void, { rejectValue: string }>;

export function withFetchByRole<P extends { data: T | null; loading: boolean; error?: string }, T>(
  WrappedComponent: React.ComponentType<P>,
  fetchers: {
    adminFetchThunk: AnyAsyncThunk<T>;
    selfFetchThunk: AnyAsyncThunk<T>;
  }
) {
  return function WithFetchByRole(props: Omit<P, 'data' | 'loading' | 'error'>) {
    const dispatch = useAppDispatch();
    const role = useAppSelector(selectUserRole);

    const adminFetch = useCallback(
      () => dispatch(fetchers.adminFetchThunk()).unwrap(),
      [dispatch, fetchers.adminFetchThunk]
    );

    const selfFetch = useCallback(
      () => dispatch(fetchers.selfFetchThunk()).unwrap(),
      [dispatch, fetchers.selfFetchThunk]
    );

    const { data, loading, error } = useFetchByRole<T>({
      role: role!,
      adminFetch: adminFetch,
      selfFetch: selfFetch,
    });

    return <WrappedComponent {...(props as P)} data={data} loading={loading} error={error} />;
  };
}
