import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api/api';

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: ['employee-dashboard'],
    queryFn: () => api.get('/api/reports/dashboard/employee').then(res => res.data),
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/api/reports/dashboard/admin').then(res => res.data),
  });
};