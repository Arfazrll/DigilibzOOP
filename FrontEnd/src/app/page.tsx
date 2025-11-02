'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/src/components/Navbar';
import { BookCard } from '@/src/components/BookCard';
import { Loading } from '@/src/components/Loading';
import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/hooks/useAuth';
import { useCart } from '@/src/hooks/useCart';
import { booksService } from '@/src/services/books';
import { Book } from '@/src/types/book';
import { Toast } from '@/src/components/Toast';

export default function Home() {
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchRecommendedBooks();
  }, []);

  const fetchRecommendedBooks = async () => {
    try {
      const books = await booksService.getRecommendedBooks(8);
      setRecommendedBooks(books);
    } catch (error) {
      console.error('Error fetching recommended books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setToast({ message: `${book.title} added to cart!`, type: 'success' });
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to BookWise
              </h1>
              <p className="text-xl mb-8">
                Your gateway to knowledge - Borrow books easily and manage your reading journey
              </p>
              {!user ? (
                <div className="flex justify-center gap-4">
                  <Link href="/register/student">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Sign In
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/books">
                  <Button size="lg">Browse Books</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Books Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recommended Books</h2>
            {user && (
              <Link href="/books">
                <Button variant="outline">View All Books</Button>
              </Link>
            )}
          </div>

          {recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddToCart={user ? handleAddToCart : undefined}
                  inCart={isInCart(book.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No books available at the moment.</p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose BookWise?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Vast Collection</h3>
                <p className="text-gray-600">
                  Access thousands of books across various categories and genres
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Easy Borrowing</h3>
                <p className="text-gray-600">
                  Simple and quick book borrowing process with online management
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
                <p className="text-gray-600">
                  Get notifications for due dates and new book arrivals
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}