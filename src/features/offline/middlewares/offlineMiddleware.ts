import type { Middleware } from '@reduxjs/toolkit';
import { enqueue } from '../slices/offlineSlice';

export const offlineMiddleware: Middleware = (store) => (next) => async (action: any) => {
  if (!navigator.onLine && action.type.endsWith('/rejected')) {
    store.dispatch(
      enqueue({
        type: action.meta.baseQueryMeta?.endpoint ?? action.type,
        payload: action.meta.arg,
      })
    );
    return;
  }
  return next(action);
};
