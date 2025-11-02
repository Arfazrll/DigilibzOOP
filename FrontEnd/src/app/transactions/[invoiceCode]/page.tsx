'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { Button } from '@/src/components/Button';
import { Badge } from '@/src/components/Badge';
import { Loading } from '@/src/components/Loading';
import { useAuth } from '@/src/hooks/useAuth';
import { transactionsService } from '@/src/services/transactions';
import { Transaction } from '@/src/types/transaction';
import { formatDate, formatCurrency } from '@/src/lib/utils';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.invoiceCode) {
      fetchTransaction(params.invoiceCode as string);
    }
  }, [params.invoiceCode]);

  const fetchTransaction = async (invoiceCode: string) => {
    try {
      const data = await transactionsService.getTransactionByInvoiceCode(invoiceCode);
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'DECLINED':
        return 'danger';
      case 'OVERDUE':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getTypeVariant = (type: string) => {
    return type === 'BORROW' ? 'info' : 'default';
  };

  if (isLoading) return <Loading />;

  if (!transaction) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Transaction not found</h2>
            <Button onClick={() => router.push('/transactions')}>Back to Transactions</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {/* Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Transaction Details</h1>
                  <p className="text-blue-100">Invoice: {transaction.invoiceCode}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusVariant(transaction.status)} className="bg-white">
                    {transaction.status}
                  </Badge>
                  <Badge variant={getTypeVariant(transaction.type)} className="bg-white">
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">User Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{transaction.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{transaction.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{transaction.user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{transaction.user.role}</p>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Transaction Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Borrow Date</p>
                  <p className="font-medium">{formatDate(transaction.dateRange.from)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Return Date</p>
                  <p className="font-medium">{formatDate(transaction.dateRange.to)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{transaction.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Evidence</p>
                  <p className="font-medium">{transaction.paymentEvidence || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Books */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Borrowed Books</h2>
              <div className="space-y-4">
                {transaction.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-24 bg-gray-200 rounded flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.author}</p>
                      {item.lateFee && (
                        <p className="text-sm text-red-600 mt-1">
                          Late Fee: {formatCurrency(Number(item.lateFee))}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Fee:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(transaction.totalFee)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}