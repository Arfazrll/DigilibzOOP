'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/books', label: 'Books', icon: '📚' },
    { href: '/dashboard/users', label: 'Users', icon: '👥' },
    { href: '/dashboard/transactions', label: 'Transactions', icon: '💳' },
    { href: '/dashboard/reviews', label: 'Reviews', icon: '⭐' },
    { href: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-600">Admin Dashboard</h2>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xl">🏠</span>
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
};