import React, { useEffect } from 'react';
import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import {
  getNotificationsForCurrentUser,
  markNotificationAsRead,
} from '../slices/notificationsSlice';
import type { Notification } from '../interfaces/NotificationInterface';
import type { RootState } from '../../../store/store';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose }) => {
  const dispatch = useAppDispath();
  const { notifications, loading, error } = useAppSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    if (visible) {
      dispatch(getNotificationsForCurrentUser());
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  return (
    <div>
      <div>
        <h3>Notificaciones</h3>
        <button onClick={onClose}>×</button>
      </div>

      {loading && (
        <div>
          <p>Cargando...</p>
        </div>
      )}

      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div>
          <p>No hay notificaciones</p>
        </div>
      )}

      <ul>
        {notifications.slice(0, 10).map((notification: Notification) => (
          <li
            key={notification._id}
            onClick={() => dispatch(markNotificationAsRead(notification._id))}
          >
            <div>
              <p>{notification.tipo}</p>
              <p>{notification.mensaje}</p>
              <p>{new Date(notification.fecha).toLocaleString()}</p>
            </div>
            {notification.estado === 'sin_leer' && <span></span>}
          </li>
        ))}
      </ul>

      <div>
        <button onClick={onClose}>Ver todas &arr;</button>
      </div>
    </div>
  );
};
