import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';

export interface Employee {
  id: number;
  user_id: number;
  employee_id: string;
  title?: string;
  name: string;
  email: string;
  temp_password?: string;
  phone?: string;
  position?: string;
  position_id?: number;
  department: string;
  department_id?: number;
  manager?: string;
  manager_id?: number;
  salary?: number;
  salary_in_words?: string;
  employment_type?: string;
  employment_status: string;
  work_location: string;
  work_schedule?: string;
  work_type?: string;
  hire_date?: string;
  role: string;
  status: string;
  active: boolean;
  created_at: string;
}

export interface EmployeeCreateRequest {
  user: {
    title?: string;
    first_name: string;
    last_name: string;
    email: string;
    temp_password?: string;
    phone?: string;
    role: string;
    active?: boolean;
  };
  employee: {
    employee_id: string;
    position?: string;
    position_id?: number;
    department_id?: number;
    manager_id?: number;
    employment_type?: string;
    employment_status: string;
    hire_date?: string;
    salary?: number;
    salary_in_words?: string;
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

export const usePositions = (departmentId?: number) => {
  return useQuery({
    queryKey: ['positions', departmentId],
    queryFn: async () => {
      const url = departmentId ? `/api/positions/?department_id=${departmentId}` : '/api/positions/';
      const response = await api.get(url);
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

export const useGenerateEmployeeId = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get('/api/employees/generate-employee-id');
      return response.data;
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to generate employee ID');
    },
  });
};

export interface DetailedEmployee {
  id: number;
  user_id: number;
  employee_id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  position_id?: number;
  department: string;
  manager?: string;
  salary?: number;
  salary_in_words?: string;
  currency_symbol?: string;
  employment_type?: string;
  employment_status: string;
  work_location: string;
  work_schedule?: string;
  work_type?: string;
  hire_date?: string;
  role: string;
  status: string;
  active: boolean;
  avatar_url?: string;
  personal_email?: string;
  gender?: string;
  date_of_birth?: string;
  marital_status?: string;
  blood_group?: string;
  nationality?: string;
  religion?: string;
  address?: string;
  qualification?: string;
  university?: string;
  graduation_year?: number;
  bonus_target?: string;
  stock_options?: string;
  last_salary_increase?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  emergency_contact_work_phone?: string;
  emergency_contact_home_phone?: string;
  emergency_contact_address?: string;
  skills_summary?: string;
  certifications?: string;
  languages_known?: string;
  hobbies?: string;
  team_size?: number;
}

export const useEmployeeDetails = (id: number) => {
  return useQuery({
    queryKey: ['employee-details', id],
    queryFn: async (): Promise<DetailedEmployee> => {
      const response = await api.get(`/api/employees/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};