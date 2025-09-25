import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../services/api/attendanceApi';
import { message } from 'antd';

export const useAttendance = () => {
  const queryClient = useQueryClient();

  const todayAttendanceQuery = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: attendanceApi.getTodayAttendance,
  });

  const attendanceHistoryQuery = useQuery({
    queryKey: ['attendance', 'history'],
    queryFn: () => attendanceApi.getUserAttendance(),
    select: (data) => {
      // Transform calendar data to attendance records format
      if (!data) return [];
      return Object.entries(data).map(([date, record]: [string, any]) => ({
        id: date,
        employeeId: 'current-user',
        employeeName: 'Current User',
        department: 'Employee',
        date,
        checkIn: record.check_in,
        checkOut: record.check_out,
        status: record.status,
        workingHours: record.hours_worked ? parseFloat(record.hours_worked.replace(/[^0-9.]/g, '')) : 0,
        totalHours: record.hours_worked ? parseFloat(record.hours_worked.replace(/[^0-9.]/g, '')) : 0,
        breakMinutes: 0,
        isManualEntry: false,
      }));
    },
  });

  const notificationsQuery = useQuery({
    queryKey: ['attendance', 'notifications'],
    queryFn: attendanceApi.getAttendanceNotifications,
  });

  const checkInMutation = useMutation({
    mutationFn: attendanceApi.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Checked in successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to check in');
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: attendanceApi.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Checked out successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to check out');
    },
  });

  const startBreakMutation = useMutation({
    mutationFn: attendanceApi.startBreak,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Break started successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to start break');
    },
  });

  const endBreakMutation = useMutation({
    mutationFn: attendanceApi.endBreak,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Break ended successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to end break');
    },
  });

  const markNotificationReadMutation = useMutation({
    mutationFn: attendanceApi.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'notifications'] });
    },
  });

  return {
    todayAttendance: todayAttendanceQuery.data,
    attendanceHistory: attendanceHistoryQuery.data,
    notifications: notificationsQuery.data,
    isLoading: todayAttendanceQuery.isLoading || attendanceHistoryQuery.isLoading,
    checkIn: checkInMutation.mutate,
    checkOut: checkOutMutation.mutate,
    startBreak: startBreakMutation.mutate,
    endBreak: endBreakMutation.mutate,
    markNotificationAsRead: markNotificationReadMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    isStartingBreak: startBreakMutation.isPending,
    isEndingBreak: endBreakMutation.isPending,
  };
};