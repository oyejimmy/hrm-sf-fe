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
      try {
        console.log('Fetching my leaves...');
        const response = await api.get(API_ENDPOINTS.LEAVES.MY_LEAVES);
        console.log('My leaves response:', response.data);
        
        // Ensure each leave has the duration field
        const leaves = response.data.map((leave: any) => ({
          ...leave,
          duration: leave.duration || leave.days_requested || 0
        }));
        
        return leaves;
      } catch (error: any) {
        console.error('API Error fetching my leaves:', error);
        
        // If it's a network error or server error, throw it to show loading state
        if (error.response?.status >= 500 || !error.response) {
          throw error;
        }
        
        // For other errors, return empty array
        return [];
      }
    },
    retry: 2,
    retryDelay: 1000,
  });
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leaveData: Partial<Leave>) => {
      console.log('API call - sending leave data:', leaveData);
      const response = await api.post(API_ENDPOINTS.LEAVES.BASE, leaveData);
      console.log('API call - received response:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Leave creation successful:', data);
      // Invalidate both general leaves and my-leaves queries
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leaves', 'my'] });
      // Don't show success message here - let the component handle it
    },
    onError: (error: any) => {
      console.error('Leave creation failed:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to submit leave request';
      // Don't show error message here - let the component handle it
      throw new Error(errorMessage);
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