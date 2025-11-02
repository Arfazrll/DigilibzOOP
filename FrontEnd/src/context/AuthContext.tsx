'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest } from '@/src/types/auth';
import { authService } from '@/src/services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  loginAdmin: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user and token from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      const userData: User = {
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role as 'admin' | 'student' | 'lecturer',
      };

      setUser(userData);
      setToken(response.token);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
    } catch (error) {
      throw error;
    }
  };

  const loginAdmin = async (credentials: LoginRequest) => {
    try {
      const response = await authService.loginAdmin(credentials);
      const userData: User = {
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role as 'admin' | 'student' | 'lecturer',
      };

      setUser(userData);
      setToken(response.token);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginAdmin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};