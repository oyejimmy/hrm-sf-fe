import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { Employee, PaginationParams, FilterParams } from '../../services/api/types';

export const useEmployees = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: async (): Promise<Employee[]> => {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES.BASE, { params });
      return response.data;
    },
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async (): Promise<Employee> => {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['employee', 'me'],
    queryFn: async (): Promise<Employee> => {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES.ME);
      return response.data;
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employeeData: Partial<Employee>) => {
      const response = await api.post(API_ENDPOINTS.EMPLOYEES.BASE, employeeData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Employee created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to create employee');
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Employee> }) => {
      const response = await api.put(API_ENDPOINTS.EMPLOYEES.BY_ID(id), data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      message.success('Employee updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to update employee');
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Employee deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to delete employee');
    },
  });
};