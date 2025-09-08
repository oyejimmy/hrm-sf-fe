import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const leaveApi = {
  createLeaveRequest: async (data: any) => {
    const response = await api.post('/leave/request', data);
    return response.data;
  },

  getMyLeaveRequests: async () => {
    const response = await api.get('/leave/my-requests');
    return response.data;
  },

  getPendingLeaveRequests: async () => {
    const response = await api.get('/leave/pending');
    return response.data;
  },

  approveLeaveRequest: async (requestId: string, data: any) => {
    const response = await api.put(`/leave/approve/${requestId}`, data);
    return response.data;
  },

  getLeaveBalance: async (userId: string, year: number) => {
    const response = await api.get(`/leave/balance/${userId}?year=${year}`);
    return response.data;
  },
};