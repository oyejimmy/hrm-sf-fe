import { api } from './api';
import { LeaveRequest, LeaveApprovalRequest, Employee } from '../../features/employee/EmployeeLeaveManagement/types';

export const leaveApi = {
  // Leave Requests
  createLeaveRequest: async (data: Partial<LeaveRequest>) => {
    const response = await api.post('/api/leaves/', data);
    return response.data;
  },

  getMyLeaveRequests: async () => {
    const response = await api.get('/api/leaves/my-leaves');
    return response.data;
  },

  getAllLeaveRequests: async (filters?: any) => {
    const response = await api.get('/api/leaves/', { params: filters });
    return response.data;
  },

  getLeaveRequest: async (leaveId: string) => {
    const response = await api.get(`/api/leaves/${leaveId}`);
    return response.data;
  },

  // Approval Workflow
  approveLeaveRequest: async (requestId: string) => {
    const response = await api.put(`/api/leaves/${requestId}/approve`);
    return response.data;
  },

  rejectLeaveRequest: async (requestId: string, data: any) => {
    const response = await api.put(`/api/leaves/${requestId}/reject`, data);
    return response.data;
  },

  cancelLeaveRequest: async (requestId: string) => {
    const response = await api.delete(`/api/leaves/${requestId}`);
    return response.data;
  },

  // Admin functions
  getAdminLeaveStats: async () => {
    const response = await api.get('/api/leaves/admin/stats');
    return response.data;
  },

  getPendingLeaveRequests: async () => {
    const response = await api.get('/api/leaves/admin/pending');
    return response.data;
  },

  getAdminLeaveNotifications: async () => {
    const response = await api.get('/api/leaves/admin/notifications');
    return response.data;
  },

  // Notifications
  markNotificationAsRead: async (notificationId: string) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.put('/api/notifications/mark-all-read');
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
  }
};