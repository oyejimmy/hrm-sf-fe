import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthInsuranceApi } from '../../../../services/api/healthInsuranceApi';

export const useHealthInsuranceData = () => {
  return useQuery({
    queryKey: ['health-insurance-data'],
    queryFn: healthInsuranceApi.getInsuranceData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useHospitals = (params?: { search?: string; city?: string }) => {
  return useQuery({
    queryKey: ['hospitals', params],
    queryFn: () => healthInsuranceApi.getHospitals(params),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: healthInsuranceApi.createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-insurance-data'] });
    },
  });
};