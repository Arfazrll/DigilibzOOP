import api from '@/src/lib/api';
import { Transaction, CreateTransactionRequest } from '@/src/types/transaction';

export const transactionsService = {
  createTransaction: async (data: CreateTransactionRequest): Promise<{ message: string; data: string }> => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  getTransactionByInvoiceCode: async (invoiceCode: string): Promise<Transaction> => {
    const response = await api.get('/transactions/invoice', { params: { invoiceCode } });
    return response.data;
  },

  getAllTransactions: async (params?: {
    search?: string;
    status?: string;
    type?: string;
    userId?: string;
  }): Promise<Transaction[]> => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  updateTransactionStatus: async (
    invoiceCode: string,
    status: string,
    type?: string
  ): Promise<{ message: string }> => {
    const response = await api.put('/transactions', null, {
      params: { invoiceCode, status, type },
    });
    return response.data;
  },
};