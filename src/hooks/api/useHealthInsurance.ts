import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { HealthInsurancePolicy, InsuranceClaim } from '../../services/api/types';

export const useMyHealthInsurancePolicy = () => {
  return useQuery({
    queryKey: ['health-insurance', 'policy', 'my'],
    queryFn: async (): Promise<HealthInsurancePolicy> => {
      const response = await api.get(API_ENDPOINTS.HEALTH_INSURANCE.MY_POLICY);
      return response.data;
    },
  });
};

export const useMyDependents = () => {
  return useQuery({
    queryKey: ['health-insurance', 'dependents', 'my'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.HEALTH_INSURANCE.MY_DEPENDENTS);
      return response.data;
    },
  });
};

export const useMyClaims = () => {
  return useQuery({
    queryKey: ['health-insurance', 'claims', 'my'],
    queryFn: async (): Promise<InsuranceClaim[]> => {
      const response = await api.get(API_ENDPOINTS.HEALTH_INSURANCE.MY_CLAIMS);
      return response.data;
    },
  });
};

export const useMyCoverage = () => {
  return useQuery({
    queryKey: ['health-insurance', 'coverage', 'my'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.HEALTH_INSURANCE.COVERAGE);
      return response.data;
    },
  });
};

export const usePanelHospitals = (city?: string) => {
  return useQuery({
    queryKey: ['health-insurance', 'panel-hospitals', city],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.HEALTH_INSURANCE.PANEL_HOSPITALS, {
        params: city ? { city } : undefined
      });
      return response.data;
    },
  });
};

export const useAddDependent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dependentData: any) => {
      const response = await api.post(API_ENDPOINTS.HEALTH_INSURANCE.DEPENDENTS, dependentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-insurance', 'dependents'] });
      message.success('Dependent added successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to add dependent');
    },
  });
};

export const useSubmitClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (claimData: Partial<InsuranceClaim>) => {
      const response = await api.post(API_ENDPOINTS.HEALTH_INSURANCE.CLAIMS, claimData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-insurance', 'claims'] });
      message.success('Insurance claim submitted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to submit claim');
    },
  });
};