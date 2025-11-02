import api from '@/src/lib/api';
import { Notification, CreateNotificationRequest } from '@/src/types/notification';

export const notificationsService = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await api.get('/notifications', { params: { userId } });
    return response.data;
  },

  markAsRead: async (notifId: string): Promise<Notification> => {
    const response = await api.put('/notifications', null, { params: { notifId } });
    return response.data;
  },

  createNotification: async (data: CreateNotificationRequest): Promise<Notification> => {
    const response = await api.post('/notifications', null, { params: data });
    return response.data;
  },

  deleteNotification: async (notifId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notifications/${notifId}`);
    return response.data;
  },
};