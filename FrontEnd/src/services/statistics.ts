import api from '@/src/lib/api';
import { Statistics } from '@/src/types/common';

export const statisticsService = {
  getStatistics: async (max?: number): Promise<{ message: string; data: Statistics }> => {
    const response = await api.get('/statistic', { params: { max } });
    return response.data;
  },
};