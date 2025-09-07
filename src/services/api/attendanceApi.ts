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

export const attendanceApi = {
  getAttendance: async (userId?: string) => {
    const url = userId ? `/attendance/user/${userId}` : '/attendance/today';
    const response = await api.get(url);
    return response.data;
  },

  logAttendance: async (attendanceData: any) => {
    const response = await api.post('/attendance/log', attendanceData);
    return response.data;
  },

  updateAttendance: async (id: string, attendanceData: any) => {
    const response = await api.put(`/attendance/${id}`, attendanceData);
    return response.data;
  },

  getAttendanceSummary: async (userId: string, month: number, year: number) => {
    const response = await api.get(`/attendance/summary/${userId}?month=${month}&year=${year}`);
    return response.data;
  },
};
