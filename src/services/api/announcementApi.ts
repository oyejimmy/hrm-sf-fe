import api from './api';
import { Announcement } from '../../hooks/api/useAnnouncements';

export const announcementApi = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const response = await api.get('/api/announcements/');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      return [];
    }
  }
};