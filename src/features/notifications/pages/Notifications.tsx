import React, { useEffect } from 'react';
import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import {
  getNotificationsForCurrentUser,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../slices/notificationsSlice';
import type { Notification } from '../interfaces/NotificationInterface';
import type { RootState } from '../../../store/store';

export const Notifications: React.FC = () => {
  const dispatch = useAppDispath();
  const { notifications, loading, error } = useAppSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    dispatch(getNotificationsForCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>Notificaciones</h2>
        <div>
          <button onClick={() => dispatch(markAllNotificationAsRead())}>
            Marcar todas como leidas
          </button>
          <button onClick={() => dispatch(deleteAllNotifications())}>Eliminar todas</button>
        </div>
      </div>

      {notifications.length === 0 && <p>No hay notificaciones...</p>}

      <ul>
        {notifications.map((notification: Notification) => (
          <li key={notification._id}>
            <div>
              <div>
                <p>{notification.tipo}</p>
                <p>{notification.mensaje}</p>
                <p>{new Date(notification.fecha).toLocaleString()}</p>
              </div>
              <div>
                {notification.estado === 'sin_leer' ? (
                  <button onClick={() => dispatch(markNotificationAsRead(notification._id))}>
                    Marcar leida
                  </button>
                ) : (
                  <button onClick={() => dispatch(markNotificationAsUnread(notification._id))}>
                    Marcar no leida
                  </button>
                )}
                <button onClick={() => dispatch(deleteNotification(notification._id))}>
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
