// ========================================
// FILE INI HANYA UNTUK TESTING FRONTEND
// HAPUS FILE INI SAAT INTEGRASI BACKEND
// ========================================

import { MOCK_USERS, simulateDelay } from './mockData';
import { LoginRequest, RegisterStudentRequest, RegisterLecturerRequest, RegisterAdminRequest, AuthResponse } from '@/src/types/auth';

const AUTH_STORAGE_KEY = 'digilibz_auth_mock';

export const mockAuthService = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    await simulateDelay(800);
    
    const user = MOCK_USERS.find(u => u.email === data.email && u.password === data.password);
    
    if (!user) {
      throw new Error('Email atau password salah');
    }

    if (user.role === 'admin') {
      throw new Error('Gunakan halaman login admin');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    const authData = { token, user: { ...user, password: undefined } };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    
    return authData;
  },

  // Login Admin
  loginAdmin: async (data: LoginRequest): Promise<AuthResponse> => {
    await simulateDelay(800);
    
    const user = MOCK_USERS.find(u => u.email === data.email && u.password === data.password);
    
    if (!user || user.role !== 'admin') {
      throw new Error('Admin tidak ditemukan atau password salah');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    const authData = { token, user: { ...user, password: undefined } };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    
    return authData;
  },

  // Register Student
  registerStudent: async (data: RegisterStudentRequest): Promise<{ message: string }> => {
    await simulateDelay(1000);
    
    const exists = MOCK_USERS.find(u => u.email === data.email);
    if (exists) {
      throw new Error('Email sudah terdaftar');
    }

    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      ...data,
      role: 'student' as const,
    };
    
    MOCK_USERS.push(newUser);
    
    return { message: 'Registrasi berhasil! Silakan login.' };
  },

  // Register Lecturer
  registerLecturer: async (data: RegisterLecturerRequest): Promise<{ message: string }> => {
    await simulateDelay(1000);
    
    const exists = MOCK_USERS.find(u => u.email === data.email);
    if (exists) {
      throw new Error('Email sudah terdaftar');
    }

    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      ...data,
      role: 'lecturer' as const,
    };
    
    MOCK_USERS.push(newUser);
    
    return { message: 'Registrasi berhasil! Silakan login.' };
  },

  // Register Admin
  registerAdmin: async (data: RegisterAdminRequest): Promise<{ message: string }> => {
    await simulateDelay(1000);
    
    const exists = MOCK_USERS.find(u => u.email === data.email);
    if (exists) {
      throw new Error('Email sudah terdaftar');
    }

    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      ...data,
      role: 'admin' as const,
    };
    
    MOCK_USERS.push(newUser);
    
    return { message: 'Registrasi admin berhasil!' };
  },

  // Logout
  logout: async (): Promise<void> => {
    await simulateDelay(300);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  // Get current user from localStorage
  getCurrentUser: (): AuthResponse | null => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },
};