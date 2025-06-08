import type { MiddlewareAPI, Dispatch } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { login, restoreAuth, logout } from '../../auth/slices/authSlice';
import { notificationReceived } from '../slices/notificationsSlice';
import type { Notification } from '../interfaces/NotificationInterface';

let socket: typeof Socket | null = null;

export const notificationMiddleware =
  (store: MiddlewareAPI) => (next: Dispatch<any>) => (action: any) => {
    if (login.fulfilled.match(action) || restoreAuth.fulfilled.match(action)) {
      const token = action.payload?.access_token;
      if (token) {
        if (socket) {
          socket.disconnect();
        }

        socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', {
          auth: { token },
          transports: ['websocket'],
          path: '/notifications',
        });

        socket.on('notification', (notification: Notification) => {
          store.dispatch(notificationReceived(notification));
        });
      }
    }

    if (logout.fulfilled.match(action)) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }

    return next(action);
  };
