import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    data: any;
  }>;
}

export const useImportEmployees = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employees: any[]): Promise<ImportResult> => {
      const response = await api.post('/api/employees/import', { employees });
      return response.data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      if (result.failed === 0) {
        message.success(`Successfully imported ${result.success} employees`);
      } else {
        message.warning(`Imported ${result.success} employees, ${result.failed} failed`);
      }
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to import employees');
    },
  });
};