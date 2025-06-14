import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onClick: () => void;
  offLabel?: string;
  onLabel?: string;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onClick,
  offLabel = 'No',
  onLabel = 'Si',
  className = '',
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onClick}
      className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-green-500' : 'bg-gray-300'} ${className}`}
    >
      <span className="sr-only">{enabled ? onLabel : offLabel}</span>
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
      <span className="absolute left-0 ml-1 text-xs font-medium text-white">
        {!enabled ? offLabel : ''}
      </span>
      <span className="absolute right-0 mr-1 text-xs font-medium text-white">
        {enabled ? onLabel : ''}
      </span>
    </button>
  );
};
