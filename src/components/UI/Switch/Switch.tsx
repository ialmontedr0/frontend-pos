import React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onCheckedChange, className = '', ...props }, ref) => {
    return (
      <label
        className={`
                        inline-flex items-center cursor-pointer ${className}
                    `}
      >
        <span
          className={`
            relative inline-block w-10 h-6 transition duration-200 ease-linear
            bg-gray-300 rounded-full shadow-inner dark:bg-gray-700
            ${checked ? 'bg-indigo-600' : ''}
          `}
        >
          <span
            className={`
              absolute left-0 inline-block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow transform transition-transform
              ${checked ? 'translate-x-4' : ''}
            `}
          />
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only"
          ref={ref}
          {...props}
        />
      </label>
    );
  }
);

Switch.displayName = 'Switch';
