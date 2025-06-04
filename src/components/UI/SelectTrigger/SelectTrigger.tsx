import React from 'react';

interface SelectTriggerProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  value,
  placeholder = 'Seleccionar...',
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md
        bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:ring-indigo-400 dark:focus:border-indigo-400
      "
    >
      <span>{value || placeholder}</span>
      <svg
        className="w-4 h-4 text-gray-500 dark:text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};
