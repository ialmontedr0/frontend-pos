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
            block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
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
