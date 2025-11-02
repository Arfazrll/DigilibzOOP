'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/src/services/auth';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { Toast } from '@/src/components/Toast';

export default function RegisterAdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setToast({ message: 'Passwords do not match!', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      await authService.registerAdmin(registrationData);
      setToast({ message: 'Admin registration successful! Please login.', type: 'success' });
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || 'Registration failed. Please try again.',
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
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👑</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Registration</h1>
          <p className="text-gray-600">Create administrator account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Admin Name"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@bookwise.com"
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="08123456789"
            />

            <div></div>

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Register Admin
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Admin Login
          </Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}