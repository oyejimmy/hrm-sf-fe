import { useQuery } from '@tanstack/react-query';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export interface LeaveBalance {
  type: string;
  totalAllocated: number;
  taken: number;
  remaining: number;
}

export const useLeaveBalance = () => {
  return useQuery({
    queryKey: ['leave-balance'],
    queryFn: async (): Promise<LeaveBalance[]> => {
      try {
        const response = await api.get('/api/leaves/balance');
        return response.data.map((item: any) => ({
          type: item.leave_type,
          totalAllocated: item.total_allocated,
          taken: item.taken,
          remaining: item.remaining
        }));
      } catch (error) {
        console.error('Failed to fetch leave balance:', error);
        // Return empty array on error so the form can still work with fallback options
        return [];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};