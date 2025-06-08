import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '../interfaces/NotificationInterface';
import { notificationsService } from '../services/notificationsService';
import type { RootState } from '../../../store/store';

interface NotificationsState {
  notification: Notification | null;
  notifications: Notification[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notification: null,
  notifications: [],
  loading: false,
  error: null,
};

// THUNKS

export const getNotificationsForCurrentUser = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>('notifications/getForCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const notificationsResponse = await notificationsService.getByCurrentUser();
    return notificationsResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getNotifications = createAsyncThunk<Notification[], void, { rejectValue: string }>(
  'notifications/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const notificationsResponse = await notificationsService.getAll();
      return notificationsResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk<
  Notification,
  string,
  { rejectValue: string }
>('notifications/markAsRead', async (notificationId, { rejectWithValue }) => {
  try {
    const notificationResponse = await notificationsService.markAsRead(notificationId);
    return notificationResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const markNotificationAsUnread = createAsyncThunk<
  Notification,
  string,
  { rejectValue: string }
>('notifications/markAsUnread', async (notificationId, { rejectWithValue }) => {
  try {
    const notificationResponse = await notificationsService.markAsUnread(notificationId);
    return notificationResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const markAllNotificationAsRead = createAsyncThunk<void, void, { rejectValue: string }>(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsService.markAllAsRead();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk<string, string, { rejectValue: string }>(
  'notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationsService.delete(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllNotifications = createAsyncThunk<void, void, { rejectValue: string }>(
  'notifications/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsService.deleteAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const selectUnreadCount = (state: RootState): number =>
  state.notifications.notifications.filter((n) => n.estado === 'sin_leer').length;

export const selectNotificationsItems = (state: RootState): Notification[] =>
  state.notifications.notifications;

export const notificationReceived = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    received(state, action: PayloadAction<Notification>) {
      state.notifications = [action.payload, ...state.notifications].slice(0, 10);
    },
  },
}).actions.received;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // === Obtener todas las notificaciones para el usuario actual ===
    builder.addCase(getNotificationsForCurrentUser.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(
      getNotificationsForCurrentUser.fulfilled,
      (state, action: PayloadAction<Notification[]>) => {
        (state.loading = false), (state.notifications = action.payload);
      }
    );

    builder.addCase(getNotificationsForCurrentUser.rejected, (state, action) => {
      (state.loading = false),
        (state.error =
          (action.payload as string) || 'Error al obtener las notificaciones del usuario');
    });

    // === Obtener todas las notificaciones ===
    builder.addCase(getNotifications.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(getNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
      (state.loading = false),
        (state.notifications = action.payload.sort(
          (a, b) => new Date(b.fecha).valueOf() - new Date(a.fecha).valueOf()
        ));
    });

    builder.addCase(getNotifications.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload as string);
    });

    // === Marcar notificacion como leida ===
    builder.addCase(markNotificationAsRead.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      const idx = state.notifications.findIndex((n) => n._id === updated._id);
      if (idx !== -1) {
        state.notifications[idx] = updated;
      }
      state.notifications = state.notifications.map((n) =>
        n._id === updated._id ? { ...n, estado: updated.estado } : n
      );
    });

    builder.addCase(markNotificationAsRead.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al marcar como leida');
    });

    // === Marcar como no leida ===
    builder.addCase(markNotificationAsUnread.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(markNotificationAsUnread.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.notifications = state.notifications.map((n) =>
        n._id === updated._id ? { ...n, estado: updated.estado } : n
      );
    });

    builder.addCase(markNotificationAsUnread.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al marcar como no leida');
    });

    // === Marcar todas las notificaciones como leidas ===
    builder.addCase(markAllNotificationAsRead.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(markAllNotificationAsRead.fulfilled, (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, estado: 'leida' }));
    });

    builder.addCase(markAllNotificationAsRead.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al marcar todas como leidas');
    });

    // === Eliminar notificacion ===
    builder.addCase(deleteNotification.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      state.notifications = state.notifications.filter((n) => n._id !== deletedId);
    });

    builder.addCase(deleteNotification.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al eliminad notificacion');
    });

    // === Eliminar todas las notificaciones ===
    builder.addCase(deleteAllNotifications.pending, (state) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(deleteAllNotifications.fulfilled, (state) => {
      state.loading = false;
      state.notifications = [];
      state.error = null;
    });

    builder.addCase(deleteAllNotifications.rejected, (state, action) => {
      (state.loading = false),
        (state.error = (action.payload as string) || 'Error al eliminar todas las notificaciones');
    });
  },
});

export default notificationsSlice.reducer;
