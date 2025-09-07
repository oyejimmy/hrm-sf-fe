import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const employeeApi = {
  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  createEmployee: async (employeeData: any) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id: string, employeeData: any) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id: string) => {
    await api.delete(`/employees/${id}`);
  },

  getEmployeeProfile: async (userId: string) => {
    const response = await api.get(`/employees/profile/${userId}`);
    return response.data;
  },
};
