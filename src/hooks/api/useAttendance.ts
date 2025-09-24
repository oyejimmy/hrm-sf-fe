import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { Attendance, PaginationParams, FilterParams } from '../../services/api/types';

export const useAttendance = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: async (): Promise<Attendance[]> => {
      const response = await api.get(API_ENDPOINTS.ATTENDANCE.BASE, { params });
      return response.data;
    },
  });
};

export const useMyAttendance = (params?: FilterParams) => {
  return useQuery({
    queryKey: ['attendance', 'my', params],
    queryFn: async (): Promise<Attendance[]> => {
      const response = await api.get(API_ENDPOINTS.ATTENDANCE.MY_ATTENDANCE, { params });
      return response.data;
    },
  });
};

export const useTodayAttendance = () => {
  return useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async (): Promise<Attendance> => {
      const response = await api.get(API_ENDPOINTS.ATTENDANCE.TODAY);
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Checked in successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to check in');
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(API_ENDPOINTS.ATTENDANCE.CHECK_OUT);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Checked out successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to check out');
    },
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attendanceData: Partial<Attendance>) => {
      const response = await api.post(API_ENDPOINTS.ATTENDANCE.BASE, attendanceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success('Attendance record created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to create attendance record');
    },
  });
};