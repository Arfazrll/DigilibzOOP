'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '@/src/types/book';

interface CartItem {
  id: string;
  title: string;
  author: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  isInCart: (bookId: string) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book) => {
    if (!isInCart(book.id)) {
      const cartItem: CartItem = {
        id: book.id,
        title: book.title,
        author: book.author,
        image: book.image,
      };
      setCart([...cart, cartItem]);
    }
  };

  const removeFromCart = (bookId: string) => {
    setCart(cart.filter((item) => item.id !== bookId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const isInCart = (bookId: string): boolean => {
    return cart.some((item) => item.id === bookId);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};