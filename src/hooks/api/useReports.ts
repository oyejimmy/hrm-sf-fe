import { useQuery } from '@tanstack/react-query';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { AdminDashboardStats, EmployeeDashboardStats, AttendanceReport } from '../../services/api/types';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async (): Promise<AdminDashboardStats> => {
      try {
        const response = await api.get(API_ENDPOINTS.REPORTS.ADMIN_DASHBOARD);
        return response.data;
      } catch (error: any) {
        console.error('Admin dashboard API error:', error);
        // Return mock data if API fails
        return {
          employees: { total: 0, active: 0, on_leave_today: 0 },
          attendance: { present_today: 0, attendance_rate: 0 },
          leaves: { pending: 0, approved_this_month: 0 },
          requests: { pending: 0 },
          complaints: { pending: 0 },
          departments: [],
          recent_notifications: [],
          recent_announcements: []
        };
      }
    },
    retry: false,
    refetchInterval: 300000,
  });
};

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: ['employee-dashboard'],
    queryFn: async (): Promise<EmployeeDashboardStats> => {
      const response = await api.get(API_ENDPOINTS.REPORTS.EMPLOYEE_DASHBOARD);
      return response.data;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useAttendanceReport = (year: number, month: number, department?: string) => {
  return useQuery({
    queryKey: ['attendance-report', year, month, department],
    queryFn: async (): Promise<AttendanceReport> => {
      const response = await api.get(API_ENDPOINTS.REPORTS.ATTENDANCE_MONTHLY, {
        params: { year, month, department }
      });
      return response.data;
    },
    enabled: !!year,
  });
};

export const useLeaveReport = (year: number, department?: string) => {
  return useQuery({
    queryKey: ['leave-report', year, department],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.REPORTS.LEAVE_SUMMARY, {
        params: { year, department }
      });
      return response.data;
    },
    enabled: !!year,
  });
};

export const usePayrollReport = (year: number, month?: number, department?: string) => {
  return useQuery({
    queryKey: ['payroll-report', year, month, department],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.REPORTS.PAYROLL_SUMMARY, {
        params: { year, month, department }
      });
      return response.data;
    },
    enabled: !!year,
  });
};