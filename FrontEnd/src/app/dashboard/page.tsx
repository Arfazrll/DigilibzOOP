'use client';

import React, { useEffect, useState } from 'react';
import { Loading } from '@/src/components/Loading';
import { Toast } from '@/src/components/Toast';
import { statisticsService } from '@/src/services/statistics';
import { Statistics } from '@/src/types/common';
import { formatDate } from '@/src/lib/utils';

export default function DashboardPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await statisticsService.getStatistics(5);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setToast({ message: 'Failed to fetch statistics', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {statistics && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Books</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.totalBook}</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.totalUser}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Transactions</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.totalTransaction}</p>
                </div>
                <div className="text-4xl">💳</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Notifications</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.totalNotifications}</p>
                </div>
                <div className="text-4xl">🔔</div>
              </div>
            </div>
          </div>

          {/* Review Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Review Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="text-2xl font-bold">{statistics.totalReview}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-2xl font-bold">{statistics.averageReview.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/dashboard/books"
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <p className="font-semibold text-blue-900">Manage Books</p>
                  <p className="text-sm text-blue-700">Add, edit, or remove books</p>
                </a>
                <a
                  href="/dashboard/transactions"
                  className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <p className="font-semibold text-green-900">Review Transactions</p>
                  <p className="text-sm text-green-700">Approve or decline borrow requests</p>
                </a>
                <a
                  href="/dashboard/users"
                  className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <p className="font-semibold text-purple-900">Manage Users</p>
                  <p className="text-sm text-purple-700">View and manage user accounts</p>
                </a>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          {statistics.recentReviews && statistics.recentReviews.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {statistics.recentReviews.map((review: any, index: number) => (
                  <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.authorName}</p>
                        <p className="text-sm text-gray-500">{review.bookTitle}</p>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 font-semibold">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.content}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(review.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}