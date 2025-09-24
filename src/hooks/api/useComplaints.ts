import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { Complaint, PaginationParams, FilterParams } from '../../services/api/types';

export const useComplaints = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['complaints', params],
    queryFn: async (): Promise<Complaint[]> => {
      const response = await api.get(API_ENDPOINTS.COMPLAINTS.BASE, { params });
      return response.data;
    },
  });
};

export const useComplaint = (id: string) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: async (): Promise<Complaint> => {
      const response = await api.get(API_ENDPOINTS.COMPLAINTS.BY_ID(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useComplaintComments = (id: string) => {
  return useQuery({
    queryKey: ['complaint-comments', id],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.COMPLAINTS.COMMENTS(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (complaintData: Partial<Complaint>) => {
      const response = await api.post(API_ENDPOINTS.COMPLAINTS.BASE, complaintData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      message.success('Complaint submitted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to submit complaint');
    },
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Complaint> }) => {
      const response = await api.put(API_ENDPOINTS.COMPLAINTS.BY_ID(id), data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      message.success('Complaint updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to update complaint');
    },
  });
};

export const useAddComplaintComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, comment }: { id: string; comment: string }) => {
      const response = await api.post(API_ENDPOINTS.COMPLAINTS.COMMENTS(id), { content: comment });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['complaint-comments', id] });
      message.success('Comment added successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to add comment');
    },
  });
};

export const useAssignComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, assignedTo }: { id: string; assignedTo: number }) => {
      const response = await api.put(API_ENDPOINTS.COMPLAINTS.ASSIGN(id), { assigned_to: assignedTo });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      message.success('Complaint assigned successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to assign complaint');
    },
  });
};

export const useResolveComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put(API_ENDPOINTS.COMPLAINTS.RESOLVE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      message.success('Complaint resolved successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to resolve complaint');
    },
  });
};