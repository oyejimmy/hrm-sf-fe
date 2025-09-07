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

export const leaveApi = {
  getLeaveRequests: async () => {
    const response = await api.get('/leave/my-requests');
    return response.data;
  },

  createLeaveRequest: async (leaveData: any) => {
    const response = await api.post('/leave/request', leaveData);
    return response.data;
  },

  approveLeaveRequest: async (id: string, approvalData: any) => {
    const response = await api.put(`/leave/approve/${id}`, approvalData);
    return response.data;
  },

  getLeaveBalance: async (userId: string, year: number) => {
    const response = await api.get(`/leave/balance/${userId}?year=${year}`);
    return response.data;
  },

  getPendingLeaveRequests: async () => {
    const response = await api.get('/leave/pending');
    return response.data;
  },
};
