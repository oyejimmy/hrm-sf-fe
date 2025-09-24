import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { Leave, PaginationParams, FilterParams } from '../../services/api/types';

export const useLeaves = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['leaves', params],
    queryFn: async (): Promise<Leave[]> => {
      const response = await api.get(API_ENDPOINTS.LEAVES.BASE, { params });
      return response.data;
    },
  });
};

export const useMyLeaves = () => {
  return useQuery({
    queryKey: ['leaves', 'my'],
    queryFn: async (): Promise<Leave[]> => {
      const response = await api.get(API_ENDPOINTS.LEAVES.MY_LEAVES);
      return response.data;
    },
  });
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leaveData: Partial<Leave>) => {
      const response = await api.post(API_ENDPOINTS.LEAVES.BASE, leaveData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      message.success('Leave request submitted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to submit leave request');
    },
  });
};

export const useApproveLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments?: string }) => {
      const response = await api.put(API_ENDPOINTS.LEAVES.APPROVE(id), { comments });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      message.success('Leave approved successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to approve leave');
    },
  });
};

export const useRejectLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments: string }) => {
      const response = await api.put(API_ENDPOINTS.LEAVES.REJECT(id), { comments });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      message.success('Leave rejected successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to reject leave');
    },
  });
};

export const useDeleteLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_ENDPOINTS.LEAVES.BASE}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      message.success('Leave request cancelled successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to cancel leave request');
    },
  });
};