'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { Select } from '@/src/components/Select';
import { Modal } from '@/src/components/Modal';
import { Loading } from '@/src/components/Loading';
import { Toast } from '@/src/components/Toast';
import { Badge } from '@/src/components/Badge';
import { notificationsService } from '@/src/services/notifications';
import { usersService } from '@/src/services/users';
import { Notification } from '@/src/types/notification';
import { User } from '@/src/types/auth';
import { formatDate } from '@/src/lib/utils';

export default function DashboardNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    message: '',
    type: 'INFO' as 'INFO' | 'REMINDER' | 'ALERT',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersService.getAllUsers();
      setUsers(data);
      if (data.length > 0) {
        // Fetch notifications for first user as example
        fetchNotifications(data[0].id);
      }
    } catch (error) {
      setToast({ message: 'Failed to fetch users', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      const data = await notificationsService.getNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      userId: users[0]?.id || '',
      title: '',
      message: '',
      type: 'INFO',
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await notificationsService.createNotification(formData);
      setToast({ message: 'Notification sent successfully!', type: 'success' });
      setIsModalOpen(false);
      if (formData.userId) {
        fetchNotifications(formData.userId);
      }
    } catch (error) {
      setToast({ message: 'Failed to send notification', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (notifId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      await notificationsService.deleteNotification(notifId);
      setToast({ message: 'Notification deleted successfully!', type: 'success' });
      setNotifications(notifications.filter((n) => n.id !== notifId));
    } catch (error) {
      setToast({ message: 'Failed to delete notification', type: 'error' });
    }
  };

  const getTypeVariant = (type: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
    switch (type) {
      case 'REMINDER':
        return 'warning';
      case 'ALERT':
        return 'danger';
      case 'INFO':
        return 'info';
      default:
        return 'default';
    }
  };

  const typeOptions = [
    { value: 'INFO', label: 'Info' },
    { value: 'REMINDER', label: 'Reminder' },
    { value: 'ALERT', label: 'Alert' },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications Management</h1>
        <Button onClick={handleOpenModal}>Send Notification</Button>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant={getTypeVariant(notification.type)}>{notification.type}</Badge>
                  {!notification.read && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">{formatDate(notification.date)}</p>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{notification.title}</h3>
              <p className="text-gray-700 mb-2">{notification.message}</p>
              <p className="text-sm text-gray-500">
                Sent to: {notification.user.name} ({notification.user.email})
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-gray-500">No notifications found</p>
        </div>
      )}

      {/* Send Notification Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send Notification">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="User"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select User' },
              ...users.map((user) => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
              })),
            ]}
            required
          />

          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={typeOptions}
            required
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Send Notification
          </Button>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}