import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { LoginRequest, LoginResponse, User } from '../../services/api/types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      message.success('Login successful');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
    onSuccess: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      message.success('Logged out successfully');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    },
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProfileStatus = () => {
  return useQuery({
    queryKey: ['profile-status'],
    queryFn: async () => {
      const response = await api.get('/auth/profile/me');
      return response.data;
    },
    enabled: !!localStorage.getItem('access_token'),
  });
};

export const useCompleteProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: {
      first_name: string;
      last_name: string;
      phone: string;
      department: string;
      position: string;
      role: string;
    }) => {
      const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['profile-status'] });
      message.success('Profile completed successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to complete profile');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      message.success('Profile updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to update profile');
    },
  });
};