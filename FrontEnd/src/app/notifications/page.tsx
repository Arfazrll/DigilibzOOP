'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/src/components/Navbar';
import { Badge } from '@/src/components/Badge';
import { Loading } from '@/src/components/Loading';
import { Button } from '@/src/components/Button';
import { Toast } from '@/src/components/Toast';
import { useAuth } from '@/src/hooks/useAuth';
import { notificationsService } from '@/src/services/notifications';
import { Notification } from '@/src/types/notification';
import { formatDate, getNotificationTypeColor } from '@/src/lib/utils';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const data = await notificationsService.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setToast({ message: 'Failed to fetch notifications', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setToast({ message: 'Notification marked as read', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to mark as read', type: 'error' });
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications(notifications.filter((notif) => notif.id !== notificationId));
      setToast({ message: 'Notification deleted', type: 'success' });
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

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>

          {isLoading ? (
            <Loading />
          ) : notifications.length > 0 ? (
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
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(notification.date)}</p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{notification.title}</h3>
                  <p className="text-gray-700 mb-4">{notification.message}</p>

                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(notification.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No notifications</h2>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}