export interface ToggleSwitchProps<T> {
  value: T;
  onToggle: (newValue: T) => void;
  onValue: T;
  offValue: T;
  offLabel?: string;
  onLabel?: string;
  className?: string;
}

export function ToggleSwitch<T>({
  value,
  onToggle,
  offValue,
  onValue,
  offLabel = String(offValue),
  onLabel = String(onValue),
  className = '',
}: ToggleSwitchProps<T>) {
  const enabled = value === onValue;

  const handleClick = () => {
    const next = enabled ? offValue : onValue;
    onToggle(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={handleClick}
      className={`
        relative inline-flex items-center h-7 w-12 rounded-full
        transition-colors duration-200 focus:outline-none
        ${enabled ? 'bg-green-500' : 'bg-gray-300'} ${className}`}
    >
      <span className="sr-only">{enabled ? onLabel : offLabel}</span>

      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
      <span className="absolute left-0 ml-0.5 text-xs font-medium text-white">
        {!enabled ? offLabel : ''}
      </span>
      <span className="absolute right-0 mr-1 text-xs font-medium text-white">
        {enabled ? onLabel : ''}
      </span>
    </button>
  );
}
