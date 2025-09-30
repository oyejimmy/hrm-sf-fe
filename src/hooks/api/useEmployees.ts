import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';

export interface Employee {
  id: number;
  user_id: number;
  employee_id: string;
  name: string;
  email: string;
  temp_password?: string;
  phone?: string;
  position?: string;
  department: string;
  department_id?: number;
  manager?: string;
  manager_id?: number;
  salary?: number;
  employment_status: string;
  work_location: string;
  work_schedule?: string;
  work_type?: string;
  hire_date?: string;
  role: string;
  status: string;
  created_at: string;
}

export interface EmployeeCreateRequest {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    temp_password?: string;
    phone?: string;
    role: string;
  };
  employee: {
    employee_id: string;
    position?: string;
    department_id?: number;
    manager_id?: number;
    employment_status: string;
    hire_date?: string;
    salary?: number;
    work_location: string;
    work_schedule?: string;
    work_type?: string;
  };
}

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<Employee[]> => {
      const response = await api.get('/api/employees/');
      return response.data;
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: EmployeeCreateRequest) => {
      const response = await api.post('/api/employees/', data);
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
    mutationFn: async ({ id, data }: { id: number; data: EmployeeCreateRequest }) => {
      const response = await api.put(`/api/employees/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
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
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/employees/${id}`);
      return response.data;
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

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('/api/employees/departments');
      return response.data;
    },
  });
};

export const useManagers = () => {
  return useQuery({
    queryKey: ['managers'],
    queryFn: async () => {
      const response = await api.get('/api/employees/managers');
      return response.data;
    },
  });
};