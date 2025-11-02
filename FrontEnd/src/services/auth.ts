import api from '@/src/lib/api';
import { LoginRequest, LoginResponse, RegisterStudentRequest, RegisterLecturerRequest, RegisterAdminRequest } from '@/src/types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  loginAdmin: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login/admin', credentials);
    return response.data;
  },

  registerStudent: async (data: RegisterStudentRequest) => {
    const response = await api.post('/users/register/student', data);
    return response.data;
  },

  registerLecturer: async (data: RegisterLecturerRequest) => {
    const response = await api.post('/users/register/lecturer', data);
    return response.data;
  },

  registerAdmin: async (data: RegisterAdminRequest) => {
    const response = await api.post('/users/register/admin', data);
    return response.data;
  },
};