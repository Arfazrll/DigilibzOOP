'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/src/components/Navbar';
import { BookCard } from '@/src/components/BookCard';
import { Loading } from '@/src/components/Loading';
import { Input } from '@/src/components/Input';
import { Select } from '@/src/components/Select';
import { Toast } from '@/src/components/Toast';
import { useAuth } from '@/src/hooks/useAuth';
import { useCart } from '@/src/hooks/useCart';
import { booksService } from '@/src/services/books';
import { Book } from '@/src/types/book';

export default function BooksPage() {
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    years: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.years) params.years = parseInt(filters.years);

      const data = await booksService.getAllBooks(params);
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setToast({ message: 'Failed to fetch books', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setToast({ message: `${book.title} added to cart!`, type: 'success' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, years: e.target.value });
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Fiction', label: 'Fiction' },
    { value: 'Non-Fiction', label: 'Non-Fiction' },
    { value: 'Science', label: 'Science' },
    { value: 'Technology', label: 'Technology' },
    { value: 'History', label: 'History' },
    { value: 'Biography', label: 'Biography' },
    { value: 'Self-Help', label: 'Self-Help' },
    { value: 'Education', label: 'Education' },
  ];

  const years = [
    { value: '', label: 'All Years' },
    ...Array.from({ length: 10 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year.toString(), label: year.toString() };
    }),
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Books</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search books..."
                value={filters.search}
                onChange={handleSearchChange}
              />
              <Select options={categories} value={filters.category} onChange={handleCategoryChange} />
              <Select options={years} value={filters.years} onChange={handleYearChange} />
            </div>
          </div>

          {/* Books Grid */}
          {isLoading ? (
            <Loading />
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
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
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-gray-600">No books found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}