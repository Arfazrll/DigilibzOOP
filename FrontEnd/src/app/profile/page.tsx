'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/src/components/Navbar';
import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { Loading } from '@/src/components/Loading';
import { Toast } from '@/src/components/Toast';
import { useAuth } from '@/src/hooks/useAuth';
import { usersService } from '@/src/services/users';
import { User } from '@/src/types/auth';

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  const fetchUserData = async () => {
    if (!authUser) return;

    try {
      const data = await usersService.getUserById(authUser.id);
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        password: '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setToast({ message: 'Failed to fetch user data', type: 'error' });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    setIsSaving(true);
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: authUser.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await usersService.updateUser(authUser.id, updateData);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      setToast({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading />;

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">User not found</h2>
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-blue-100">{user.email}</p>
                  <p className="text-blue-100 capitalize">Role: {user.role}</p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-6">
              {!isEditing ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-medium">{user.phone || 'Not provided'}</p>
                    </div>

                    {user.nim && (
                      <div>
                        <p className="text-sm text-gray-500">NIM</p>
                        <p className="text-lg font-medium">{user.nim}</p>
                      </div>
                    )}

                    {user.nip && (
                      <div>
                        <p className="text-sm text-gray-500">NIP</p>
                        <p className="text-lg font-medium">{user.nip}</p>
                      </div>
                    )}

                    {user.year && (
                      <div>
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="text-lg font-medium">{user.year}</p>
                      </div>
                    )}
                  </div>

                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <Input
                    label="New Password (leave blank to keep current)"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />

                  <div className="flex gap-4">
                    <Button type="submit" isLoading={isSaving}>
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone || '',
                          password: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}