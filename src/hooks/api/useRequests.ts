import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { EmployeeRequest, PaginationParams, FilterParams } from '../../services/api/types';

export const useRequests = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['requests', params],
    queryFn: async (): Promise<EmployeeRequest[]> => {
      const response = await api.get(API_ENDPOINTS.REQUESTS.BASE, { params });
      return response.data;
    },
  });
};

export const useMyRequests = (params?: FilterParams) => {
  return useQuery({
    queryKey: ['requests', 'my', params],
    queryFn: async (): Promise<EmployeeRequest[]> => {
      const response = await api.get(API_ENDPOINTS.REQUESTS.MY_REQUESTS, { params });
      return response.data;
    },
  });
};

export const useRequest = (id: string) => {
  return useQuery({
    queryKey: ['request', id],
    queryFn: async (): Promise<EmployeeRequest> => {
      const response = await api.get(API_ENDPOINTS.REQUESTS.BY_ID(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useRequestLogs = (id: string) => {
  return useQuery({
    queryKey: ['request-logs', id],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.REQUESTS.LOGS(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestData: Partial<EmployeeRequest>) => {
      const response = await api.post(API_ENDPOINTS.REQUESTS.BASE, requestData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      message.success('Request submitted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to submit request');
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmployeeRequest> }) => {
      const response = await api.put(API_ENDPOINTS.REQUESTS.BY_ID(id), data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      message.success('Request updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to update request');
    },
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments?: string }) => {
      const response = await api.put(API_ENDPOINTS.REQUESTS.APPROVE(id), { approver_comments: comments });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      message.success('Request approved successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to approve request');
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments: string }) => {
      const response = await api.put(API_ENDPOINTS.REQUESTS.REJECT(id), { approver_comments: comments });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      message.success('Request rejected successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to reject request');
    },
  });
};

export const useMyRequestStats = () => {
  return useQuery({
    queryKey: ['request-stats', 'my'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.REQUESTS.STATS);
      return response.data;
    },
  });
};