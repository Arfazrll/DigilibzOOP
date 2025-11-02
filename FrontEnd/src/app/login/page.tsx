'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { Toast } from '@/src/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.error || 'Login failed. Please check your credentials.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Sign in to your BookWise account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Dont have an account?{' '}
            <Link href="/register/student" className="text-blue-600 hover:text-blue-700 font-medium">
              Register as Student
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Admin Login
            </Link>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}