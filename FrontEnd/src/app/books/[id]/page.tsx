'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { Button } from '@/src/components/Button';
import { Loading } from '@/src/components/Loading';
import { Badge } from '@/src/components/Badge';
import { Modal } from '@/src/components/Modal';
import { Toast } from '@/src/components/Toast';
import { useAuth } from '@/src/hooks/useAuth';
import { useCart } from '@/src/hooks/useCart';
import { booksService } from '@/src/services/books';
import { reviewsService } from '@/src/services/reviews';
import { Book } from '@/src/types/book';
import { formatDate } from '@/src/lib/utils';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBook(params.id as string);
    }
  }, [params.id]);

  const fetchBook = async (id: string) => {
    try {
      const data = await booksService.getBookById(id, 10);
      setBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
      setToast({ message: 'Failed to fetch book details', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      setToast({ message: `${book.title} added to cart!`, type: 'success' });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !book) return;

    setIsSubmitting(true);
    try {
      await reviewsService.createReview({
        bookId: book.id,
        review: {
          authorId: user.id,
          rating: reviewData.rating,
          content: reviewData.content,
        },
      });

      setToast({ message: 'Review submitted successfully!', type: 'success' });
      setIsReviewModalOpen(false);
      setReviewData({ rating: 5, content: '' });
      
      // Refresh book data to get new review
      fetchBook(book.id);
    } catch (error) {
      setToast({ message: 'Failed to submit review', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (!book) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Book not found</h2>
            <Button onClick={() => router.push('/books')}>Back to Books</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
              {/* Book Image */}
              <div className="md:col-span-1">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                  {book.image ? (
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Book Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="info">{book.category}</Badge>
                    <Badge variant="default">{book.year}</Badge>
                    {book.language && <Badge variant="default">{book.language}</Badge>}
                  </div>

                  {book.rating && (
                    <div className="flex items-center mb-4">
                      <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-2 text-lg font-semibold">{book.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div>
                    <p className="text-sm text-gray-500">ISBN</p>
                    <p className="font-medium">{book.isbn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Copies</p>
                    <p className="font-medium">{book.availableCopies}</p>
                  </div>
                  {book.rackNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Rack Number</p>
                      <p className="font-medium">{book.rackNumber}</p>
                    </div>
                  )}
                  {book.lateFee && (
                    <div>
                      <p className="text-sm text-gray-500">Late Fee</p>
                      <p className="font-medium">Rp {book.lateFee.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {book.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{book.description}</p>
                  </div>
                )}

                {user && (
                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!book.canBorrow || book.availableCopies === 0 || isInCart(book.id)}
                      className="flex-1"
                    >
                      {isInCart(book.id) ? 'In Cart' : book.canBorrow ? 'Add to Cart' : 'Not Available'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsReviewModalOpen(true)}>
                      Write Review
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            {book.reviews && book.reviews.length > 0 && (
              <div className="border-t p-8">
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                <div className="space-y-4">
                  {book.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.authorName}</p>
                          <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 font-semibold">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={reviewData.content}
              onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
              placeholder="Share your thoughts about this book..."
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Submit Review
          </Button>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}