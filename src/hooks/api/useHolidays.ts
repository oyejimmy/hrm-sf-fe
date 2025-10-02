import { useQuery } from '@tanstack/react-query';
import { holidayApi } from '../../services/api/holidayApi';

export interface Holiday {
  id: number;
  name: string;
  date: string;
  holiday_type: string;
  description: string;
}

export const useHolidays = () => {
  return useQuery<Holiday[], Error>({
    queryKey: ['holidays'],
    queryFn: holidayApi.getHolidays,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};