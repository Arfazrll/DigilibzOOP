export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  description?: string;
  image?: string;
  quota: number;
  rackNumber?: string;
  isbn: string;
  language?: string;
  availableCopies: number;
  lateFee?: number;
  canBorrow: boolean;
  rating?: number;
  reviews?: Review[];
}

export interface Review {
  id: string;
  bookTitle: string;
  authorName: string;
  date: string;
  rating: number;
  content: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  category: string;
  year: number;
  description?: string;
  image?: string;
  quota: number;
  rackNumber?: string;
  isbn: string;
  language?: string;
  availableCopies: number;
  lateFee?: number;
  canBorrow?: boolean;
  rating?: number;
}