import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          cursor-pointer hover:bg-gray-200 dark:hover:bg-[#1d2935] transition-colors block h-11 w-full px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white text-gray-600
          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500
          dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
          dark:focus:ring-indigo-400 dark:focus:border-indigo-400 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
