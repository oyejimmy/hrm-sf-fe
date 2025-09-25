import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import { AttendanceRecord, AttendanceAction, AttendanceOverride } from '../../features/employee/EmployeeAttendance/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const attendanceApi = {
  // Employee Actions
  logAttendance: async (action: AttendanceAction, data?: any) => {
    const response = await api.post('/attendance/log', { action, ...data });
    return response.data;
  },

  checkIn: async () => {
    const response = await api.post('/attendance/check-in');
    return response.data;
  },

  checkOut: async () => {
    const response = await api.post('/attendance/check-out');
    return response.data;
  },

  startBreak: async (type: string = 'general') => {
    const response = await api.post('/attendance/break/start', { break_type: type });
    return response.data;
  },

  endBreak: async () => {
    const response = await api.post('/attendance/break/end');
    return response.data;
  },

  // Data Retrieval
  getTodayAttendance: async () => {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  getAttendanceRecords: async (limit: number = 30) => {
    const response = await api.get(`/api/attendance/records?limit=${limit}`);
    return response.data;
  },

  getUserAttendance: async (year?: number, month?: number) => {
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || (currentDate.getMonth() + 1);
    
    const response = await api.get(`/attendance/calendar?year=${targetYear}&month=${targetMonth}`);
    return response.data;
  },

  getAttendanceSummary: async (userId: string, month: number, year: number) => {
    const response = await api.get(`/attendance/summary/${userId}?month=${month}&year=${year}`);
    return response.data;
  },

  getAllAttendanceToday: async () => {
    const response = await api.get('/attendance/all/today');
    return response.data;
  },

  getAttendanceStats: async () => {
    const response = await api.get('/attendance/stats');
    return response.data;
  },

  // Admin Functions
  updateAttendance: async (attendanceId: string, data: Partial<AttendanceRecord>) => {
    const response = await api.put(`/attendance/${attendanceId}`, data);
    return response.data;
  },

  overrideAttendance: async (override: AttendanceOverride) => {
    const response = await api.post('/attendance/override', override);
    return response.data;
  },

  markAbsent: async (employeeId: string, date: string, reason?: string) => {
    const response = await api.post('/attendance/mark-absent', { employeeId, date, reason });
    return response.data;
  },

  // Notifications
  getAttendanceNotifications: async () => {
    const response = await api.get('/attendance/notifications');
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await api.put(`/attendance/notifications/${notificationId}/read`);
    return response.data;
  },

  // Reports
  exportAttendanceReport: async (filters: any) => {
    const response = await api.get('/attendance/export', { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },

  // Validation
  validateAttendanceEntry: async (data: any) => {
    const response = await api.post('/attendance/validate', data);
    return response.data;
  },

  // Auto-absence marking
  processAutoAbsence: async () => {
    const response = await api.post('/attendance/auto-absence');
    return response.data;
  }
};