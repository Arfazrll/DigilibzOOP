import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/src/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};