'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { TransactionCard } from '@/src/components/TransactionCard';
import { Loading } from '@/src/components/Loading';
import { Select } from '@/src/components/Select';
import { Input } from '@/src/components/Input';
import { Toast } from '@/src/components/Toast';
import { useAuth } from '@/src/hooks/useAuth';
import { transactionsService } from '@/src/services/transactions';
import { Transaction } from '@/src/types/transaction';

export default function TransactionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, filters]);

  const fetchTransactions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await transactionsService.getAllTransactions({
        userId: user.id,
        search: filters.search || undefined,
        status: filters.status || undefined,
        type: filters.type || undefined,
      });
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setToast({ message: 'Failed to fetch transactions', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, type: e.target.value });
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'DECLINED', label: 'Declined' },
    { value: 'OVERDUE', label: 'Overdue' },
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'BORROW', label: 'Borrow' },
    { value: 'RETURN', label: 'Return' },
  ];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Transactions</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by invoice code..."
                value={filters.search}
                onChange={handleSearchChange}
              />
              <Select options={statusOptions} value={filters.status} onChange={handleStatusChange} />
              <Select options={typeOptions} value={filters.type} onChange={handleTypeChange} />
            </div>
          </div>

          {/* Transactions List */}
          {isLoading ? (
            <Loading />
          ) : transactions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No transactions found</h2>
              <p className="text-gray-600 mb-6">
                {filters.search || filters.status || filters.type
                  ? 'Try adjusting your filters'
                  : 'Start borrowing books to see your transactions here'}
              </p>
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}