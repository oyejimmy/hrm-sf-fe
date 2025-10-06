import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { Payslip, PaginationParams, FilterParams } from '../../services/api/types';

// Employee Hooks
export const useMyPayslips = (year?: number) => {
  return useQuery({
    queryKey: ['payslips', 'my', year],
    queryFn: async (): Promise<Payslip[]> => {
      try {
        const response = await api.get(API_ENDPOINTS.PAYROLL.MY_PAYSLIPS, { 
          params: year ? { year } : undefined 
        });
        return response.data || [];
      } catch (error: any) {
        console.error('Error fetching payslips:', error);
        if (error.response?.status === 500) {
          message.error('Server error. Please try again later.');
        }
        return [];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePayslipDetails = (payslipId: number) => {
  return useQuery({
    queryKey: ['payslip', 'details', payslipId],
    queryFn: async (): Promise<Payslip | null> => {
      try {
        const response = await api.get(API_ENDPOINTS.PAYROLL.PAYSLIP_DETAILS(payslipId.toString()));
        return response.data;
      } catch (error: any) {
        console.error('Error fetching payslip details:', error);
        if (error.response?.status === 404) {
          message.error('Payslip not found');
        } else if (error.response?.status === 500) {
          message.error('Server error. Please try again later.');
        }
        return null;
      }
    },
    enabled: !!payslipId,
    retry: 1,
  });
};

// Admin Hooks
export const useAdminPayslips = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['payslips', 'admin', params],
    queryFn: async (): Promise<Payslip[]> => {
      try {
        const response = await api.get(API_ENDPOINTS.PAYROLL.ADMIN_PAYSLIPS, { params });
        return response.data || [];
      } catch (error: any) {
        console.error('Error fetching admin payslips:', error);
        if (error.response?.status === 500) {
          message.error('Server error. Please try again later.');
        }
        return [];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApprovePayslip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payslipId: number) => {
      const response = await api.put(API_ENDPOINTS.PAYROLL.APPROVE_PAYSLIP(payslipId.toString()));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] });
      message.success('Payslip approved successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to approve payslip');
    },
  });
};

// PDF Download
export const useDownloadPayslipPDF = () => {
  return useMutation({
    mutationFn: async (payslipId: number) => {
      const response = await api.get(API_ENDPOINTS.PAYROLL.PAYSLIP_PDF(payslipId.toString()), {
        responseType: 'blob',
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip_${payslipId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    },
    onSuccess: () => {
      message.success('Payslip downloaded successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to download payslip');
    },
  });
};

export const useMySalaryStructure = () => {
  return useQuery({
    queryKey: ['salary-structure', 'my'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.PAYROLL.SALARY_STRUCTURE);
      return response.data;
    },
  });
};

export const useMyBonuses = () => {
  return useQuery({
    queryKey: ['bonuses', 'my'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.PAYROLL.BONUSES);
      return response.data;
    },
  });
};

// Legacy hook for backward compatibility
export const usePayslips = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['payslips', params],
    queryFn: async (): Promise<Payslip[]> => {
      const response = await api.get(API_ENDPOINTS.PAYROLL.PAYSLIPS, { params });
      return response.data;
    },
  });
};