export interface Transaction {
  id: string;
  invoiceCode: string;
  dateRange: {
    from: string;
    to: string;
  };
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'OVERDUE';
  type: 'BORROW' | 'RETURN';
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  totalFee: number;
  paymentMethod?: string;
  paymentEvidence?: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  title: string;
  author: string;
  image?: string;
  lateFee?: number;
}

export interface CreateTransactionRequest {
  userId: string;
  items: {
    id: string;
    title: string;
    image?: string;
    author: string;
  }[];
  totalFee: number;
  paymentMethod: string;
  paymentEvidence?: string;
  dateFrom: string;
  dateTo: string;
}