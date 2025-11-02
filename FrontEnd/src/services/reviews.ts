import api from '@/src/lib/api';
import { ReviewDTO, CreateReviewRequest } from '@/src/types/review';

export const reviewsService = {
  getReviews: async (bookId?: string, max?: number): Promise<ReviewDTO[]> => {
    const response = await api.get('/reviews', { params: { bookId, max } });
    return response.data;
  },

  createReview: async (data: CreateReviewRequest): Promise<any> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },
};