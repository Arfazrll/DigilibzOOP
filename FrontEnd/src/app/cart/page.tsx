'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { Toast } from '@/src/components/Toast';
import { useAuth } from '@/src/hooks/useAuth';
import { useCart } from '@/src/hooks/useCart';
import { transactionsService } from '@/src/services/transactions';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, removeFromCart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    dateFrom: '',
    dateTo: '',
    paymentMethod: '',
    paymentEvidence: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await transactionsService.createTransaction({
        userId: user.id,
        items: cart,
        totalFee: 0,
        paymentMethod: formData.paymentMethod,
        paymentEvidence: formData.paymentEvidence,
        dateFrom: formData.dateFrom,
        dateTo: formData.dateTo,
      });

      setToast({ message: 'Transaction created successfully!', type: 'success' });
      clearCart();
      
      setTimeout(() => {
        router.push(`/transactions/${response.data}`);
      }, 1500);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || 'Failed to create transaction',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please login to access cart</h2>
            <Button onClick={() => router.push('/login')}>Login</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some books to get started</p>
              <Button onClick={() => router.push('/books')}>Browse Books</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
                    <div className="w-20 h-28 bg-gray-200 rounded flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.author}</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-bold mb-4">Borrowing Details</h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Borrow From"
                      type="date"
                      name="dateFrom"
                      value={formData.dateFrom}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Return By"
                      type="date"
                      name="dateTo"
                      value={formData.dateTo}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Payment Method"
                      type="text"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Cash, Bank Transfer"
                    />

                    <Input
                      label="Payment Evidence (Optional)"
                      type="text"
                      name="paymentEvidence"
                      value={formData.paymentEvidence}
                      onChange={handleChange}
                      placeholder="Receipt number or reference"
                    />

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Books:</span>
                        <span className="font-semibold">{cart.length}</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                      Create Borrow Request
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}