'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { Toast } from '@/src/components/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
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
      await loginAdmin(formData);
      setToast({ message: 'Admin login successful!', type: 'success' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.error || 'Login failed. Admin access only.',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in with administrator credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Admin Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="admin@bookwise.com"
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
            Sign In as Admin
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            ← Back to User Login
          </Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}