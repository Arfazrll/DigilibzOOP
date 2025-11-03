// ========================================
// FILE INI HANYA UNTUK TESTING FRONTEND
// HAPUS FILE INI SAAT INTEGRASI BACKEND
// ========================================

import { User } from '@/src/types/auth';
import { Book } from '@/src/types/book';
import { Transaction, TransactionUser } from '@/src/types/transaction';
import { Notification } from '@/src/types/notification';

// Dummy Users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@digilibz.com',
    password: 'admin123',
    name: 'Admin Digilibz',
    role: 'admin',
    phone: '08123456789',
  },
  {
    id: '2',
    email: 'student@digilibz.com',
    password: 'student123',
    name: 'Ahmad Wijaya',
    role: 'student',
    phone: '08123456790',
    nim: '1301223001',
    year: '2022',
  },
  {
    id: '3',
    email: 'lecturer@digilibz.com',
    password: 'lecturer123',
    name: 'Dr. Budi Santoso',
    role: 'lecturer',
    phone: '08123456791',
    nip: '198501012010121001',
  },
];

// Dummy Books
export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    category: 'Programming',
    language: 'English',
    year: 2008,
    description: 'A Handbook of Agile Software Craftsmanship. Belajar menulis kode yang bersih dan mudah dipelihara.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    rackNumber: 'A-001',
    availableCopies: 10,
    quota: 10,
    canBorrow: true,
    lateFee: 5000,
    rating: 4.8,
    reviews: [
      {
        id: '1',
        authorId: '2',
        authorName: 'Ahmad Wijaya',
        bookId: '1',
        rating: 5,
        content: 'Buku yang sangat bagus untuk programmer!',
        date: '2025-01-15',
      },
    ],
  },
  {
    id: '2',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '9780262033848',
    category: 'Computer Science',
    language: 'English',
    year: 2009,
    description: 'Comprehensive introduction to algorithms and data structures.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41T0iBxY8FL._SX440_BO1,204,203,200_.jpg',
    rackNumber: 'A-002',
    availableCopies: 8,
    quota: 10,
    canBorrow: true,
    lateFee: 7000,
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Design Patterns',
    author: 'Gang of Four',
    isbn: '9780201633610',
    category: 'Software Engineering',
    language: 'English',
    year: 1994,
    description: 'Elements of Reusable Object-Oriented Software',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg',
    rackNumber: 'A-003',
    availableCopies: 12,
    quota: 15,
    canBorrow: true,
    lateFee: 6000,
    rating: 4.9,
  },
  {
    id: '4',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '9780135957059',
    category: 'Programming',
    language: 'English',
    year: 2019,
    description: 'Your Journey to Mastery',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg',
    rackNumber: 'A-004',
    availableCopies: 15,
    quota: 15,
    canBorrow: true,
    lateFee: 5500,
    rating: 4.6,
  },
  {
    id: '5',
    title: 'Java: The Complete Reference',
    author: 'Herbert Schildt',
    isbn: '9781260440232',
    category: 'Programming',
    language: 'English',
    year: 2018,
    description: 'Comprehensive Java Programming Guide',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51NAFnwpsnL._SX396_BO1,204,203,200_.jpg',
    rackNumber: 'A-005',
    availableCopies: 10,
    quota: 12,
    canBorrow: true,
    lateFee: 6500,
    rating: 4.5,
  },
  {
    id: '6',
    title: 'Head First Design Patterns',
    author: 'Eric Freeman',
    isbn: '9780596007126',
    category: 'Software Engineering',
    language: 'English',
    year: 2004,
    description: 'A Brain-Friendly Guide to Design Patterns',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51S8VRKG7FL._SX430_BO1,204,203,200_.jpg',
    rackNumber: 'A-006',
    availableCopies: 7,
    quota: 10,
    canBorrow: true,
    lateFee: 5000,
    rating: 4.7,
  },
  {
    id: '7',
    title: 'Effective Java',
    author: 'Joshua Bloch',
    isbn: '9780134685991',
    category: 'Programming',
    language: 'English',
    year: 2017,
    description: 'Best Practices for Java Programming',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51E2055ZGUL._SX376_BO1,204,203,200_.jpg',
    rackNumber: 'A-007',
    availableCopies: 9,
    quota: 10,
    canBorrow: true,
    lateFee: 6000,
    rating: 4.8,
  },
  {
    id: '8',
    title: 'You Don\'t Know JS',
    author: 'Kyle Simpson',
    isbn: '9781491924464',
    category: 'Programming',
    language: 'English',
    year: 2015,
    description: 'Deep dive into JavaScript',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41T5H8u7fUL._SX331_BO1,204,203,200_.jpg',
    rackNumber: 'A-008',
    availableCopies: 11,
    quota: 12,
    canBorrow: true,
    lateFee: 5000,
    rating: 4.6,
  },
];

// Helper to convert User to TransactionUser
const toTransactionUser = (user: User): TransactionUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
});

// Dummy Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    invoiceCode: 'INV-2025-001',
    user: toTransactionUser(MOCK_USERS[1]),
    items: [
      {
        id: '1',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        image: MOCK_BOOKS[0].image,
        lateFee: 0,
      },
    ],
    dateRange: {
      from: '2025-01-10',
      to: '2025-01-20',
    },
    totalFee: 0,
    status: 'APPROVED',
    type: 'BORROW',
    paymentMethod: 'Cash',
    paymentEvidence: 'PAID-001',
  },
  {
    id: '2',
    invoiceCode: 'INV-2025-002',
    user: toTransactionUser(MOCK_USERS[1]),
    items: [
      {
        id: '3',
        title: 'Design Patterns',
        author: 'Gang of Four',
        image: MOCK_BOOKS[2].image,
        lateFee: 0,
      },
    ],
    dateRange: {
      from: '2025-01-15',
      to: '2025-01-25',
    },
    totalFee: 0,
    status: 'PENDING',
    type: 'BORROW',
    paymentMethod: 'Transfer',
    paymentEvidence: 'PAID-002',
  },
];

// Dummy Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    user: { id: '2', name: 'Ahmad Wijaya' },
    title: 'Peminjaman Disetujui',
    message: 'Peminjaman buku "Clean Code" telah disetujui. Silakan ambil buku di perpustakaan.',
    type: 'INFO',
    date: '2025-01-10T10:00:00',
    read: false,
  },
  {
    id: '2',
    user: { id: '2', name: 'Ahmad Wijaya' },
    title: 'Pengingat Pengembalian',
    message: 'Buku "Clean Code" akan jatuh tempo dalam 2 hari. Harap segera kembalikan.',
    type: 'REMINDER',
    date: '2025-01-18T09:00:00',
    read: false,
  },
];

// Helper untuk simulasi delay API
export const simulateDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper untuk generate ID
let idCounter = 100;
export const generateId = () => {
  idCounter++;
  return idCounter.toString();
};