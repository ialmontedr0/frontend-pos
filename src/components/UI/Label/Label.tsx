import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ htmlFor, className = '', children, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        twMerge('mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400', className)
      )}
      {...props}
    >
      {children}
    </label>
  );
};
