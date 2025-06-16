import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  deleteNotification,
  getNotificationsForCurrentUser,
  markNotificationAsRead,
} from '../slices/notificationsSlice';
import type { Notification } from '../interfaces/NotificationInterface';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';
import { BiCheck, BiTrash } from 'react-icons/bi';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const tipoMap: Record<string, string> = {
  creacion_usuario: 'Creacion Usuario',
  actualizacion_usuario: 'Actualizacion Usuario',
  eliminacion_usuario: 'Eliminacion Usuario',
  creacion_cliente: 'Creacion Cliente',
  actualizacion_cliente: 'Actualizacion Cliente',
  eliminacion_cliente: 'Eliminacion Cliente',
  creacion_producto: 'Creacion Producto',
  actualizacion_producto: 'Actualizacion Producto',
  actualizacion_precio_producto: 'Actualizacion Precio Producto',
  actualizacion_stock_producto: 'Actualizacion Stock Producto',
  eliminacion_producto: 'Eliminacion Producto',
  creacion_categoria: 'Creacion Categoria',
  actualizacion_categoria: 'Actualizacion Categoria',
  eliminacion_categoria: 'Eliminacion Categoria',
  creacion_proveedor: 'Creacion Proveedor',
  actualizacion_proveedor: 'Actualizacion Proveedor',
  eliminacion_proveedor: 'Eliminacion Proveedor',
  creacion_venta: 'Nueva Venta',
  eliminacion_venta: 'Cancelacion Venta',
  creacion_pago: 'Nuevo Pago',
  eliminacion_pago: 'Cancelacion Pago',
  apertura_caja: 'Apertura Caja',
  cierre_caja: 'Cierre Caja',
  registrar_transaccion: 'Nueva Transaccion',
  eliminar_caja: 'Eliminacion Caja',
  crear_synclog: 'Nuevo SyncLog',
  resolver_synclog: 'Resolucion SyncLog',
  eliminar_synclog: 'Eliminacion SyncLog',
};

const timeSince = (dateStr: string) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const intervals: [number, string][] = [
    [86400, 'día'],
    [3600, 'hora'],
    [60, 'minuto'],
    [1, 'segundo'],
  ];
  for (const [secs, unit] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return `Hace ${count} ${unit}${count > 1 ? 's' : ''}`;
    }
  }
  return 'Justo ahora';
};

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notifications, loading, error } = useAppSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    if (visible) {
      dispatch(getNotificationsForCurrentUser());
    }
  }, [visible, dispatch]);

  const goNotifications = () => {
    navigate('/notifications');
    onClose();
  };

  if (!visible) return null;

  return (
    <div
      className="
        absolute right-4 mt-2 w-80
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-lg z-50
        "
    >
      <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Notificaciones</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {loading && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">Cargando...</div>
      )}

      {error && <div className="p-4 text-red-500 dark:text-red-400">Error: {error}</div>}

      {!loading && notifications.length === 0 && (
        <div className="p-4 text-gray-600 dark:text-gray-400">No hay notificaciones</div>
      )}

      <ul>
        {notifications.slice(0, 10).map((notification: Notification) => (
          <li
            key={notification._id}
            onClick={() => dispatch(markNotificationAsRead(notification._id))}
            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-start"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {tipoMap[notification.tipo] || notification.tipo}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    notification.estado === 'leida'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-green-100 text-red-800 dark:bg-green-900 dark:text-red-200'
                  }`}
                >
                  {notification.estado === 'leida' ? 'Leida' : 'No leida'}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{notification.mensaje}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {timeSince(notification.fecha)}
              </p>
            </div>
            <div className="ml-2 flex flex-col items-center space-y-2">
              {notification.estado !== 'leida' && (
                <button
                  onClick={() => dispatch(markNotificationAsRead(notification._id))}
                  className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  title="Marcar como leida"
                >
                  <BiCheck size={16} />
                </button>
              )}
              <button
                onClick={() => dispatch(deleteNotification(notification._id))}
                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                title="Eliminar"
              >
                <BiTrash size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-center">
        <button onClick={goNotifications}>Ver todas</button>
      </div>
    </div>
  );
};
