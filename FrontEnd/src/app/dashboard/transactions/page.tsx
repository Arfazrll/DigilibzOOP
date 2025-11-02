'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/Button';
import { Select } from '@/src/components/Select';
import { Loading } from '@/src/components/Loading';
import { Toast } from '@/src/components/Toast';
import { Badge } from '@/src/components/Badge';
import { Modal } from '@/src/components/Modal';
import { transactionsService } from '@/src/services/transactions';
import { Transaction } from '@/src/types/transaction';
import { formatDate, formatCurrency } from '@/src/lib/utils';

export default function DashboardTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({ status: '', type: '' });
  const [filters, setFilters] = useState({ status: '', type: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const data = await transactionsService.getAllTransactions({
        status: filters.status || undefined,
        type: filters.type || undefined,
      });
      setTransactions(data);
    } catch (error) {
      setToast({ message: 'Failed to fetch transactions', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setUpdateData({
      status: transaction.status,
      type: transaction.type,
    });
    setIsModalOpen(true);
  };

  const handleUpdateTransaction = async () => {
    if (!selectedTransaction) return;

    setIsUpdating(true);
    try {
      await transactionsService.updateTransactionStatus(
        selectedTransaction.invoiceCode,
        updateData.status,
        updateData.type
      );
      setToast({ message: 'Transaction updated successfully!', type: 'success' });
      setIsModalOpen(false);
      fetchTransactions();
    } catch (error) {
      setToast({ message: 'Failed to update transaction', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
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

  const getTypeVariant = (type: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
    return type === 'BORROW' ? 'info' : 'default';
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

  if (isLoading) return <Loading />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transactions Management</h1>
        <div className="flex gap-4">
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />
          <Select
            options={typeOptions}
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          />
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/transactions/${transaction.invoiceCode}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {transaction.invoiceCode}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.user.name}</div>
                    <div className="text-sm text-gray-500">{transaction.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{formatDate(transaction.dateRange.from)}</div>
                    <div>{formatDate(transaction.dateRange.to)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(transaction.status)}>{transaction.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getTypeVariant(transaction.type)}>{transaction.type}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.totalFee)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(transaction)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No transactions found</p>
        </div>
      )}

      {/* Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Transaction"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Invoice Code</p>
              <p className="font-medium">{selectedTransaction.invoiceCode}</p>
            </div>

            <Select
              label="Status"
              options={statusOptions.filter((opt) => opt.value !== '')}
              value={updateData.status}
              onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
            />

            <Select
              label="Type"
              options={typeOptions.filter((opt) => opt.value !== '')}
              value={updateData.type}
              onChange={(e) => setUpdateData({ ...updateData, type: e.target.value })}
            />

            <Button onClick={handleUpdateTransaction} className="w-full" isLoading={isUpdating}>
              Update Transaction
            </Button>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}