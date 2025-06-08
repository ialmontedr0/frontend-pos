import api from '../../../services/api';
import type { Notification } from '../interfaces/NotificationInterface';

export const notificationsService = {
  getAll: () => api.get<Notification[]>('/notifications'),
  getById: (notificationId: string) => api.get<Notification>(`/notifications/id/${notificationId}`),
  getByUser: (userId: string) => api.get<Notification[]>(`/notifications/user/${userId}`),
  getByCurrentUser: () => api.get<Notification[]>('/notifications/current-user'),
  markAsRead: (notificationId: string) =>
    api.patch<Notification>(`/notifications/read/${notificationId}`),
  markAsUnread: (notificationId: string) =>
    api.patch<Notification>(`/notifications/unread/${notificationId}`),
  markAllAsRead: () => api.patch<any>('/notifications/read-all'),
  delete: (notificationId: string) => api.delete<any>(`/notifications/${notificationId}`),
  deleteAll: () => api.delete<any>(`/notifications/user`),
};
