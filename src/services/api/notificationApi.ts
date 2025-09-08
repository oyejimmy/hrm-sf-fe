import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const notificationApi = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  createNotification: async (data: any) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },
};