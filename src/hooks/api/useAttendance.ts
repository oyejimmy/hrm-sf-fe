import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { Attendance, PaginationParams, FilterParams } from '../../services/api/types';

export type AttendanceRecord = Attendance;

// Employee Attendance Hooks

// Get employee's own attendance records
export const useMyAttendance = (params?: { year?: number; month?: number }) => {
  return useQuery({
    queryKey: ['attendance', 'my', params],
    queryFn: async () => {
      const response = await api.get('/api/attendance/my-attendance', { params });
      return response.data.records || [];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get employee's attendance records for history table
export const useMyAttendanceRecords = (limit: number = 30) => {
  return useQuery({
    queryKey: ['attendance', 'records', limit],
    queryFn: async () => {
      const response = await api.get('/api/attendance/records', { params: { limit } });
      return response.data || [];
    },
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get today's attendance
export const useTodayAttendance = () => {
  return useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async () => {
      const response = await api.get('/api/attendance/today');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    staleTime: 0, // Always fresh for today's data
  });
};

// Get attendance notifications
export const useAttendanceNotifications = () => {
  return useQuery({
    queryKey: ['attendance', 'notifications'],
    queryFn: async () => {
      const response = await api.get('/api/attendance/notifications');
      return response.data || [];
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 1,
  });
};

// Check in mutation
export const useCheckIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/attendance/check-in');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success(data.message || 'Checked in successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to check in';
      message.error(errorMessage);
    },
  });
};

// Check out mutation
export const useCheckOut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/attendance/check-out');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success(data.message || 'Checked out successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to check out';
      message.error(errorMessage);
    },
  });
};

// Start break mutation
export const useStartBreak = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (breakType: string = 'general') => {
      const response = await api.post('/api/attendance/break/start', { break_type: breakType });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success(data.message || 'Break started');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to start break';
      message.error(errorMessage);
    },
  });
};

// End break mutation
export const useEndBreak = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/attendance/break/end');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success(data.message || 'Break ended');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to end break';
      message.error(errorMessage);
    },
  });
};

// Mark notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.put(`/api/attendance/notifications/${notificationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'notifications'] });
    },
    onError: (error: any) => {
      message.error('Failed to mark notification as read');
    },
  });
};

// Admin/HR Attendance Hooks

// Get all attendance records (Admin/HR)
export const useAttendanceRecords = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['attendance', 'admin', params],
    queryFn: async () => {
      const response = await api.get('/api/attendance/', { params });
      return response.data || [];
    },
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get admin attendance stats
export const useAttendanceStats = () => {
  return useQuery({
    queryKey: ['attendance-stats'],
    queryFn: async () => {
      const response = await api.get('/api/attendance/admin/stats');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
    staleTime: 30000, // 30 seconds
  });
};

// Get all attendance today (Admin)
export const useAllAttendanceToday = () => {
  return useQuery({
    queryKey: ['all-attendance-today'],
    queryFn: async () => {
      const response = await api.get('/api/attendance/admin/all-today');
      return response.data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    staleTime: 15000, // 15 seconds
  });
};

// Get admin attendance notifications
export const useAdminAttendanceNotifications = () => {
  return useQuery({
    queryKey: ['attendance', 'admin', 'notifications'],
    queryFn: async () => {
      const response = await api.get('/api/attendance/admin/notifications');
      return response.data || [];
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 1,
  });
};

// Create attendance record (Admin/HR)
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<AttendanceRecord>) => {
      const response = await api.post('/api/attendance/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Attendance record created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to create attendance record';
      message.error(errorMessage);
    },
  });
};

// Export attendance report (Admin/HR)
export const useExportAttendanceReport = () => {
  return useMutation({
    mutationFn: async (filters: any) => {
      const response = await api.post('/api/attendance/admin/export-report', filters);
      return response.data;
    },
    onSuccess: (data) => {
      message.success(data.message || 'Report export initiated');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to export report';
      message.error(errorMessage);
    },
  });
};

// Process auto-absence (Admin/HR)
export const useProcessAutoAbsence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/attendance/admin/process-auto-absence');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success(data.message || 'Auto-absence processing completed');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to process auto-absence';
      message.error(errorMessage);
    },
  });
};