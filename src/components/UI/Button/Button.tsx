interface ButtonProps {
  type?: 'submit' | 'button';
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  variant?: 'primary' | 'outline' | 'success' | 'destructive' | 'icon';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  size = 'md',
  variant = 'primary',
  startIcon,
  endIcon,
  onClick,
  className = '',
  disabled,
}) => {
  const sizeClasses = {
    sm: 'px-4 py-3 text-sm',
    md: 'px-5 py-3.5 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };
  const variantClasses = {
    primary:
      'cursor-pointer bg-brand-500 hover:bg-blue-700 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300',
    outline:
      'cursor-pointer bg-white hover:bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
    success:
      'cursor-pointer bg-green-600 text-white hover:bg-green-700 shadow-theme-xs dark:bg-green-400 dark:hover:bg-green-600 disabled:bg-green-200',
    destructive:
      'cursor-pointer bg-red-600 text-white hover:bg-red-700 shadow-theme-xs dark:bg-red-400 dark:hover:bg-red-600 disabled:bg-red-200',
    icon: 'cursor-pointer bg-transparent dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600',
  };

  return (
    <button
      type={type}
      className={`inline-flex rounded-full items-center justify-center gap-2 transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
