import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import { LeaveRequest, LeaveApprovalRequest, Employee } from '../../features/employee/EmployeeLeaveManagement/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const leaveApi = {
  // Leave Requests
  createLeaveRequest: async (data: Partial<LeaveRequest>) => {
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

  getAllLeaveRequests: async (filters?: any) => {
    const response = await api.get('/leave/all', { params: filters });
    return response.data;
  },

  // Approval Workflow
  processLeaveApproval: async (approval: LeaveApprovalRequest) => {
    const response = await api.put(`/leave/process/${approval.requestId}`, approval);
    return response.data;
  },

  approveLeaveRequest: async (requestId: string, data: any) => {
    const response = await api.put(`/leave/approve/${requestId}`, data);
    return response.data;
  },

  rejectLeaveRequest: async (requestId: string, data: any) => {
    const response = await api.put(`/leave/reject/${requestId}`, data);
    return response.data;
  },

  holdLeaveRequest: async (requestId: string, data: any) => {
    const response = await api.put(`/leave/hold/${requestId}`, data);
    return response.data;
  },

  requestAdditionalDetails: async (requestId: string, data: any) => {
    const response = await api.put(`/leave/request-details/${requestId}`, data);
    return response.data;
  },

  // Leave Balance
  getLeaveBalance: async (userId: string, year?: number) => {
    const params = year ? { year } : {};
    const response = await api.get(`/leave/balance/${userId}`, { params });
    return response.data;
  },

  // Notifications
  getLeaveNotifications: async () => {
    const response = await api.get('/leave/notifications');
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await api.put(`/leave/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.put('/leave/notifications/read-all');
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get('/leave/dashboard-stats');
    return response.data;
  },

  // Employee Directory (for recipient selection)
  getEmployeeDirectory: async () => {
    const response = await api.get('/employees/directory');
    return response.data;
  },

  // Email Notifications
  sendLeaveNotificationEmail: async (data: {
    requestId: string;
    recipientIds: string[];
    type: 'request' | 'approval' | 'rejection' | 'hold' | 'details_request';
  }) => {
    const response = await api.post('/leave/send-notification', data);
    return response.data;
  },
};