import React from 'react';
import Link from 'next/link';
import { Transaction } from '@/src/types/transaction';
import { Badge } from './Badge';
import { formatDate, formatCurrency } from '@/src/lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
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

  return (
    <Link href={`/transactions/${transaction.invoiceCode}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{transaction.invoiceCode}</h3>
            <p className="text-sm text-gray-600">{transaction.user.name}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={getStatusVariant(transaction.status)}>{transaction.status}</Badge>
            <Badge variant={getTypeVariant(transaction.type)}>{transaction.type}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="text-gray-500">From</p>
            <p className="font-medium">{formatDate(transaction.dateRange.from)}</p>
          </div>
          <div>
            <p className="text-gray-500">To</p>
            <p className="font-medium">{formatDate(transaction.dateRange.to)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-sm text-gray-600">
            {transaction.items.length} book{transaction.items.length > 1 ? 's' : ''}
          </div>
          <div className="font-semibold text-lg">{formatCurrency(transaction.totalFee)}</div>
        </div>
      </div>
    </Link>
  );
};