import api from '@/src/lib/api';
import { Book, CreateBookRequest } from '@/src/types/book';

export const booksService = {
  getAllBooks: async (params?: { search?: string; category?: string; years?: number }): Promise<Book[]> => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  getRecommendedBooks: async (max?: number): Promise<Book[]> => {
    const response = await api.get('/books/recommended', { params: { max } });
    return response.data;
  },

  getBookById: async (id: string, max?: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`, { params: { max } });
    return response.data;
  },

  createBook: async (data: CreateBookRequest): Promise<Book> => {
    const response = await api.post('/books', data);
    return response.data;
  },

  updateBook: async (id: string, data: Partial<CreateBookRequest>): Promise<Book> => {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};