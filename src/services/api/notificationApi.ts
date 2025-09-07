import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationApi = {
  getNotifications: async () => {
    const response = await api.get('/notifications/my-notifications');
    return response.data;
  },

  sendNotification: async (notificationData: any) => {
    const response = await api.post('/notifications/send', notificationData);
    return response.data;
  },

  markAsRead: async (id: string) => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.put('/notifications/mark-all-read');
  },
};
