import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api/authApi';
import { tokenStorage } from '../utils/security';
import { message } from 'antd';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  team_id?: string;
  phone?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  redirect_url?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getCurrentUser,
    enabled: !!tokenStorage.getToken('access_token'),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      tokenStorage.setToken('access_token', data.access_token);
      tokenStorage.setToken('refresh_token', data.refresh_token);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      message.success('Login successful!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Login failed');
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      message.success('Account created successfully! Please login.');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Signup failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      tokenStorage.removeToken('access_token');
      tokenStorage.removeToken('refresh_token');
      queryClient.clear();
      message.success('Logged out successfully');
    },
    onError: () => {
      tokenStorage.removeToken('access_token');
      tokenStorage.removeToken('refresh_token');
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !!tokenStorage.getToken('access_token'),
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
};