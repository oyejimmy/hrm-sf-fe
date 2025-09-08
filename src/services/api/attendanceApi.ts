import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const attendanceApi = {
  logAttendance: async (data: any) => {
    const response = await api.post('/attendance/log', data);
    return response.data;
  },

  getTodayAttendance: async () => {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  getUserAttendance: async (userId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await api.get(`/attendance/user/${userId}?${params.toString()}`);
    return response.data;
  },

  getAttendanceSummary: async (userId: string, month: number, year: number) => {
    const response = await api.get(`/attendance/summary/${userId}?month=${month}&year=${year}`);
    return response.data;
  },

  updateAttendance: async (attendanceId: string, data: any) => {
    const response = await api.put(`/attendance/${attendanceId}`, data);
    return response.data;
  },
};