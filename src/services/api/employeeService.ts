import api from './api';

interface EmployeeQueryParams {
  skip?: number;
  limit?: number;
  department?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

interface Employee {
  id: string;
  user_id: string;
  department: string;
  position: string;
  employment_status: string;
  hire_date: string;
  salary: number;
}

export const fetchEmployees = async (params?: EmployeeQueryParams) => {
  const response = await api.get<Employee[]>('/employees/', { params });
  return response.data;
};

export const createEmployee = async (employeeData: any) => {
  const response = await api.post<Employee>('/employees/', employeeData);
  return response.data;
};

export const updateEmployee = async (employeeId: string, employeeData: any) => {
  const response = await api.put<Employee>(`/employees/${employeeId}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (employeeId: string) => {
  const response = await api.delete(`/employees/${employeeId}`);
  return response.data;
};