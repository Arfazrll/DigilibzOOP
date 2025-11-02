'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { Modal } from '@/src/components/Modal';
import { Loading } from '@/src/components/Loading';
import { Toast } from '@/src/components/Toast';
import { booksService } from '@/src/services/books';
import { Book, CreateBookRequest } from '@/src/types/book';

export default function DashboardBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
    category: '',
    year: new Date().getFullYear(),
    description: '',
    image: '',
    quota: 0,
    rackNumber: '',
    isbn: '',
    language: '',
    availableCopies: 0,
    lateFee: 0,
    canBorrow: true,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await booksService.getAllBooks();
      setBooks(data);
    } catch (error) {
      setToast({ message: 'Failed to fetch books', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setIsEditing(true);
      setCurrentBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        year: book.year,
        description: book.description || '',
        image: book.image || '',
        quota: book.quota,
        rackNumber: book.rackNumber || '',
        isbn: book.isbn,
        language: book.language || '',
        availableCopies: book.availableCopies,
        lateFee: book.lateFee ? Number(book.lateFee) : 0,
        canBorrow: book.canBorrow,
      });
    } else {
      setIsEditing(false);
      setCurrentBook(null);
      setFormData({
        title: '',
        author: '',
        category: '',
        year: new Date().getFullYear(),
        description: '',
        image: '',
        quota: 0,
        rackNumber: '',
        isbn: '',
        language: '',
        availableCopies: 0,
        lateFee: 0,
        canBorrow: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentBook(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && currentBook) {
        await booksService.updateBook(currentBook.id, formData);
        setToast({ message: 'Book updated successfully!', type: 'success' });
      } else {
        await booksService.createBook(formData);
        setToast({ message: 'Book created successfully!', type: 'success' });
      }
      handleCloseModal();
      fetchBooks();
    } catch (error) {
      setToast({ message: 'Failed to save book', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await booksService.deleteBook(id);
      setToast({ message: 'Book deleted successfully!', type: 'success' });
      fetchBooks();
    } catch (error) {
      setToast({ message: 'Failed to delete book', type: 'error' });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Books Management</h1>
        <Button onClick={() => handleOpenModal()}>Add New Book</Button>
      </div>

      {books.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">ISBN: {book.isbn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        book.availableCopies > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {book.availableCopies} copies
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal(book)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No books found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? 'Edit Book' : 'Add New Book'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <Input
              label="Year"
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
            <Input
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
            <Input
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            />
            <Input
              label="Available Copies"
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              required
            />
            <Input
              label="Quota"
              type="number"
              name="quota"
              value={formData.quota}
              onChange={handleChange}
              required
            />
            <Input
              label="Rack Number"
              name="rackNumber"
              value={formData.rackNumber}
              onChange={handleChange}
            />
            <Input
              label="Late Fee"
              type="number"
              name="lateFee"
              value={formData.lateFee}
              onChange={handleChange}
            />
            <Input
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="canBorrow"
              checked={formData.canBorrow}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Can be borrowed</label>
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            {isEditing ? 'Update Book' : 'Create Book'}
          </Button>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}