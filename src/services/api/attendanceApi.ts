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
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  // Get user notifications
  getUserNotifications: async (unreadOnly: boolean = false) => {
    const response = await api.get(`/api/notifications/?unread_only=${unreadOnly}`);
    return response.data;
  },

  getUnreadNotificationCount: async () => {
    const response = await api.get('/api/notifications/unread-count');
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.put('/api/notifications/mark-all-read');
    return response.data;
  },

  // Admin functions
  getAttendanceStats: async () => {
    const response = await api.get('/api/attendance/admin/stats');
    return response.data;
  },

  getAllAttendanceToday: async () => {
    const response = await api.get('/api/attendance/admin/all-today');
    return response.data;
  },

  getAdminAttendanceNotifications: async () => {
    const response = await api.get('/api/attendance/admin/notifications');
    return response.data;
  },

  exportAttendanceReport: async (filters: any) => {
    const response = await api.post('/api/attendance/admin/export-report', filters, {
      responseType: 'blob'
    });
    return response.data;
  },

  processAutoAbsence: async () => {
    const response = await api.post('/api/attendance/admin/process-auto-absence');
    return response.data;
  }
};