// src/components/UI/Label/Label.tsx
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

// Usamos forwardRef para que reciba ref de afuera
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, className = '', children, ...props }, ref) => {
    return (
      <label
        ref={ref} // <-- aquí
        htmlFor={htmlFor}
        tabIndex={props.tabIndex ?? 0} // <-- lo hacemos foco‑able
        className={clsx(
          twMerge('mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400', className)
        )}
        {...props} // acepta tabIndex, onFocus, etc.
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';
