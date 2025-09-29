import { api } from './api';
import { AttendanceRecord, AttendanceAction } from '../../features/employee/EmployeeAttendance/types';

export const attendanceApi = {
  // Employee Actions
  checkIn: async () => {
    const response = await api.post('/api/attendance/check-in');
    return response.data;
  },

  checkOut: async () => {
    const response = await api.post('/api/attendance/check-out');
    return response.data;
  },

  startBreak: async (type: string = 'general') => {
    const response = await api.post('/api/attendance/break/start', { break_type: type });
    return response.data;
  },

  endBreak: async () => {
    const response = await api.post('/api/attendance/break/end');
    return response.data;
  },

  // Data Retrieval
  getTodayAttendance: async () => {
    const response = await api.get('/api/attendance/today');
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
    
    const response = await api.get(`/api/attendance/my-attendance?year=${targetYear}&month=${targetMonth}`);
    return response.data;
  },



  // Notifications
  getAttendanceNotifications: async () => {
    const response = await api.get('/api/attendance/notifications');
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await api.put(`/api/attendance/notifications/${notificationId}/read`);
    return response.data;
  },

  // Admin functions (mock implementations)
  getAttendanceStats: async () => {
    return {
      todayPresent: 0,
      todayAbsent: 0,
      todayLate: 0,
      onBreak: 0,
      totalEmployees: 0
    };
  },

  getAllAttendanceToday: async () => {
    return [];
  },

  exportAttendanceReport: async (filters: any) => {
    return new Blob(['Mock report data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  },

  processAutoAbsence: async () => {
    return { message: 'Auto-absence processing completed' };
  }
};