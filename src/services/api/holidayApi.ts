import api from './api';
import { Holiday } from '../../hooks/api/useHolidays';

export const holidayApi = {
  getHolidays: async (): Promise<Holiday[]> => {
    const response = await api.get('/api/holidays/');
    return response.data;
  }
};