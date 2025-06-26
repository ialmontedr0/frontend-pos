import React from 'react';

export type Frequency = 'monthly' | 'quarterly' | 'annually';

interface ChartTabProps {
  current: Frequency;
  onChange: (freq: Frequency) => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ current, onChange }) => {
  const options: { label: string; value: Frequency }[] = [
    { label: 'Mensual', value: 'monthly' },
    { label: 'Cuatrimestral', value: 'quarterly' },
    { label: 'Anual', value: 'annually' },
  ];

  const getButtonClass = (value: Frequency) =>
    current === value
      ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
            option.value
          )}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ChartTab;
