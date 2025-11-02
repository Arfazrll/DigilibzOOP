'use client';

import React, { useEffect, useState } from 'react';
import { Loading } from '@/src/components/Loading';
import { Toast } from '@/src/components/Toast';
import { reviewsService } from '@/src/services/reviews';
import { ReviewDTO } from '@/src/types/review';
import { formatDate } from '@/src/lib/utils';

export default function DashboardReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewsService.getReviews(undefined, 50);
      setReviews(data);
    } catch (error) {
      setToast({ message: 'Failed to fetch reviews', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reviews Management</h1>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{review.bookTitle}</h3>
                  <p className="text-sm text-gray-600">
                    by {review.authorName} • {formatDate(review.date)}
                  </p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-lg font-semibold">{review.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-gray-500">No reviews found</p>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}