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
    queryFn: () => attendanceApi.getUserAttendance('current-user'),
  });

  const notificationsQuery = useQuery({
    queryKey: ['attendance', 'notifications'],
    queryFn: attendanceApi.getAttendanceNotifications,
  });

  const logAttendanceMutation = useMutation({
    mutationFn: attendanceApi.logAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Attendance logged successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to log attendance');
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
    logAttendance: logAttendanceMutation.mutate,
    markNotificationAsRead: markNotificationReadMutation.mutate,
    isLoggingAttendance: logAttendanceMutation.isPending,
  };
};