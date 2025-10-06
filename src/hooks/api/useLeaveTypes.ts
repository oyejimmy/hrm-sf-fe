import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';

export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  default_allocation: number;
  is_active: boolean;
  created_at: string;
}

export const useLeaveTypes = () => {
  return useQuery({
    queryKey: ['leave-types'],
    queryFn: async (): Promise<LeaveType[]> => {
      const response = await api.get('/api/leave-types');
      return response.data;
    },
  });
};

export const useCreateLeaveType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<LeaveType>) => {
      const response = await api.post('/api/leave-types', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      message.success('Leave type created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to create leave type');
    },
  });
};

export const useUpdateLeaveType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<LeaveType> }) => {
      const response = await api.put(`/api/leave-types/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      message.success('Leave type updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to update leave type');
    },
  });
};

export const useDeleteLeaveType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/leave-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      message.success('Leave type deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to delete leave type');
    },
  });
};