import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const employeeApi = {
  getEmployees: async (skip = 0, limit = 20, department?: string) => {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    if (department) params.append('department', department);
    
    const response = await api.get(`/employees?${params.toString()}`);
    return response.data;
  },

  getEmployee: async (employeeId: string) => {
    const response = await api.get(`/employees/${employeeId}`);
    return response.data;
  },

  createEmployee: async (data: any) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  updateEmployee: async (employeeId: string, data: any) => {
    const response = await api.put(`/employees/${employeeId}`, data);
    return response.data;
  },

  deleteEmployee: async (employeeId: string) => {
    const response = await api.delete(`/employees/${employeeId}`);
    return response.data;
  },

  getEmployeeProfile: async (userId: string) => {
    const response = await api.get(`/employees/profile/${userId}`);
    return response.data;
  },
};