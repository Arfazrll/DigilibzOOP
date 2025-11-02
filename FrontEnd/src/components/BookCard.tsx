import React from 'react';
import Link from 'next/link';
import { Book } from '@/src/types/book';
import { Button } from './Button';

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
  inCart?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onAddToCart, inCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/books/${book.id}`}>
        <div className="aspect-[3/4] relative bg-gray-200">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/books/${book.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 line-clamp-2">
            {book.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>

        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-gray-500">{book.category}</span>
          <span className="text-gray-500">{book.year}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {book.rating ? (
              <>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-gray-600">{book.rating.toFixed(1)}</span>
              </>
            ) : (
              <span className="text-gray-400 text-sm">No rating</span>
            )}
          </div>
          <span className={`text-sm ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Not available'}
          </span>
        </div>

        {onAddToCart && (
          <Button
            variant={inCart ? 'secondary' : 'primary'}
            size="sm"
            className="w-full"
            onClick={() => onAddToCart(book)}
            disabled={!book.canBorrow || book.availableCopies === 0 || inCart}
          >
            {inCart ? 'In Cart' : book.canBorrow ? 'Add to Cart' : 'Not Available'}
          </Button>
        )}
      </div>
    </div>
  );
};