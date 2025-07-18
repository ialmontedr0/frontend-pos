import { useEffect } from 'react';
import { BiCheck, BiRefresh, BiTrash, BiCheckDouble, BiTrashAlt } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
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
import Spinner from '../../../components/UI/Spinner/Spinner';
import { tipoMap } from '../types/types';
import Badge from '../../../components/UI/Badge/Badge';
import { myAlertError } from '../../../utils/commonFunctions';
import Button from '../../../components/UI/Button/Button';

export default function Notifications() {
  const dispatch = useAppDispatch();
  const myAlert = withReactContent(Swal);
  const { notifications, loading, error } = useAppSelector(
    (state: RootState) => state.notifications
  );

  const handleMarkAsRead = (notificationId: string) => {
    myAlert
      .fire({
        title: 'Marcar como leida',
        text: `Estas seguro que desease marcar esta notificacion como leida?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(markNotificationAsRead(notificationId))
            .then(() => {})
            .catch((error: any) => {
              myAlertError(error);
            });
        }
      });
  };

  const handleMarkAsUnread = (notificationId: string) => {
    myAlert
      .fire({
        title: 'Marcar como no leida',
        text: `Estas seguro que desease marcar esta notificacion como no leida?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(markNotificationAsUnread(notificationId))
            .then(() => {})
            .catch((error) => {
              myAlertError(error)
            });
        }
      });
  };

  const handleMarkAllAsRead = () => {
    myAlert
      .fire({
        title: 'Marcar todas como leidas!',
        text: `Estas seguro que deseas marcar todas las notificaciones como leidas?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(markAllNotificationAsRead())
            .unwrap()
            .then(() => {})
            .catch((error: any) => {
              myAlertError(error);
            });
        }
      });
  };

  const handleDelete = (notificationId: string) => {
    myAlert
      .fire({
        title: 'Eliminar notificacion',
        text: `Estas seguro que deseas eliminar la notificacion?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteNotification(notificationId))
            .unwrap()
            .then(() => {})
            .catch((error) => {
              myAlertError(error);
            });
        }
      });
  };

  const handleDeleteAll = () => {
    myAlert
      .fire({
        title: 'Eliminar notificaciones',
        text: `Estas seguro que deseas eliminar todas las notificaciones?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteAllNotifications())
            .unwrap()
            .then(() => {})
            .catch((error) => {
              myAlertError(error);
            });
        }
      });
  };

  useEffect(() => {
    dispatch(getNotificationsForCurrentUser());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-regular text-black dark:text-gray-200">
          Notificaciones
        </h2>
        <div className="flex gap-2 space-x-2">
          <Button
            variant="icon"
            size="icon"
            onClick={() => handleMarkAllAsRead()}
            startIcon={<BiCheckDouble size={20} />}
          ></Button>
          <Button
            size="icon"
            variant="icon"
            onClick={() => handleDeleteAll()}
            startIcon={<BiTrashAlt size={20} />}
          ></Button>
        </div>
      </div>

      {loading && <Spinner />}

      {error && <div className="text-center text-red-600 dark:text-gray-400">Error: {error}</div>}

      {!loading && notifications.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400">No hay notificaciones...</div>
      )}

      <ul className="space-y-4">
        {notifications.map((notification: Notification) => (
          <li
            key={notification._id}
            className="bg-white dark:bg-gray-800 borer border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0"
          >
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                {tipoMap[notification.tipo] || notification.tipo}
              </p>
              <p className="text-gray-700 dark:text-gray-200">{notification.mensaje}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {formatDistanceToNow(new Date(notification.fecha), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                <span className="flex justify-end">
                  {notification.estado === 'leida' ? (
                    <Badge color="success">Leida</Badge>
                  ) : (
                    <Badge color="warning">Sin leer</Badge>
                  )}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex space-x-2">
              {notification.estado === 'sin_leer' ? (
                <button
                  onClick={() => handleMarkAsRead(notification._id)}
                  className="p-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition"
                  title="Marcar como leida"
                >
                  <BiCheck />
                </button>
              ) : (
                <button
                  onClick={() => handleMarkAsUnread(notification._id)}
                  className="p-2 bg-yellow dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700 transition"
                  title="Marcar como no leida"
                >
                  <BiRefresh />
                </button>
              )}
              <button
                onClick={() => handleDelete(notification._id)}
                className="p-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded hover:bg-red-200 dark:hover:bg-red-700 transition"
                title="Eliminar"
              >
                <BiTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
