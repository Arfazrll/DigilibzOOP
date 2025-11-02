import api from '@/src/lib/api';
import { User } from '@/src/types/auth';

export const usersService = {
  getAllUsers: async (role?: string): Promise<User[]> => {
    const response = await api.get('/users', { params: { role } });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};