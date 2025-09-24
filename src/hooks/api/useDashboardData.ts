import { useQuery } from '@tanstack/react-query';
import api from '../../services/api/api';
import { useAuthContext } from '../../contexts/AuthContext';

export const useDashboardData = () => {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['dashboard', user?.role],
    queryFn: async () => {
      const endpoint = user?.role === 'admin' || user?.role === 'hr' 
        ? '/api/reports/dashboard/admin'
        : '/api/reports/dashboard/employee';
      
      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};