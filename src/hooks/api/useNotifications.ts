import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationData: {
      title: string;
      message: string;
      type: string;
      priority: string;
      recipient_id?: number;
      recipient_role?: string;
    }) => {
      const response = await api.post(API_ENDPOINTS.NOTIFICATIONS.BASE, notificationData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      console.error('Failed to create notification:', error);
    },
  });
};