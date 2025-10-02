import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import Cookies from 'js-cookie';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { LoginRequest, LoginResponse, User } from '../../services/api/types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Store tokens in both cookies and localStorage
      Cookies.set('access_token', data.access_token, { expires: 7 });
      Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      Cookies.set('user_email', data.user.email, { expires: 7 });
      Cookies.set('has_temp_password', data.user.temp_password ? 'true' : 'false', { expires: 7 });
      Cookies.set('is_profile_complete', data.user.is_profile_complete ? 'true' : 'false', { expires: 7 });
      
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      message.success('Login successful');
      
      // Handle redirect based on backend response
      if (data.user.redirect_url) {
        window.location.href = data.user.redirect_url;
      } else {
        // Fallback to dashboard
        const roleRedirects = {
          admin: '/admin/dashboard',
          hr: '/admin/dashboard',
          team_lead: '/team-lead/dashboard',
          employee: '/employee/dashboard'
        };
        window.location.href = roleRedirects[data.user.role as keyof typeof roleRedirects] || '/employee/dashboard';
      }
    },
    onError: (error: any) => {
      // Don't show message here, let the component handle it
      console.error('Login error:', error);
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
      // Remove all cookies
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('user_email');
      Cookies.remove('has_temp_password');
      Cookies.remove('is_profile_complete');
      
      // Clear all localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.clear();
      
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
    enabled: !!Cookies.get('access_token'),
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
    enabled: !!Cookies.get('access_token'),
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

export const useSignup = () => {
  return useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      role: string;
      phone?: string;
    }) => {
      console.log('Signup API call with data:', userData);
      console.log('API endpoint:', API_ENDPOINTS.AUTH.SIGNUP);
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
      console.log('Signup response:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Signup successful:', data);
      message.success({
        content: 'Account created successfully! Redirecting to login...',
        duration: 3,
      });
      // Navigate to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      message.error(error.response?.data?.detail || 'Signup failed');
    },
  });
};

export const useOnboarding = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (onboardingData: any) => {
      const response = await api.post('/auth/onboarding', onboardingData);
      return response.data;
    },
    onSuccess: () => {
      // Update profile complete status in cookies
      Cookies.set('is_profile_complete', 'true', { expires: 7 });
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['profile-status'] });
      message.success('Onboarding completed successfully');
      
      // Redirect to employee dashboard
      window.location.href = '/employee/dashboard';
    },
    onError: (error: any) => {
      console.error('Onboarding error:', error);
      let errorMessage = 'Onboarding failed';
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((err: any) => err.msg).join(', ');
        } else {
          errorMessage = error.response.data.detail;
        }
      }
      message.error(errorMessage);
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