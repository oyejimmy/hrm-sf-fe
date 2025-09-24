import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { Payslip, PaginationParams, FilterParams } from '../../services/api/types';

export const usePayslips = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['payslips', params],
    queryFn: async (): Promise<Payslip[]> => {
      const response = await api.get(API_ENDPOINTS.PAYROLL.PAYSLIPS, { params });
      return response.data;
    },
  });
};

export const useMyPayslips = (year?: number) => {
  return useQuery({
    queryKey: ['payslips', 'my', year],
    queryFn: async (): Promise<Payslip[]> => {
      const response = await api.get(API_ENDPOINTS.PAYROLL.MY_PAYSLIPS, { 
        params: year ? { year } : undefined 
      });
      return response.data;
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