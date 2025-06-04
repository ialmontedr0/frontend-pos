import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
                  block w-full px-3 py-2 border border-gray-300 rounded-md
                  bg-white text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-500
                  dark:focus:ring-indigo-400 dark:focus:border-indigo-400 
                  ${className}
                `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'