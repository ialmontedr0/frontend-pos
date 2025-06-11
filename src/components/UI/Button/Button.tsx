import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus:visible::ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#4d39f6] text-white hover:bg-[#4f39f6] focus-visible:ring-[#e5e7eb] dark:bg-[#4b5563] dark:text-gray-900 dark:hover:bg-[#4b5563] dark:focus-visible:ring-[#6c55fa]',
        secondary:
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-950 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-50',
        outline:
          'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-50',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 focus:visible:ring-red-500 dark:bg-red-700 dark:text-white dark:hover:bg-red-800 dark:focus-visible:ring-red-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  hideTextOnMobile?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconPosition = 'left',
      hideTextOnMobile = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? 'span' : 'button';

    const renderContent = () => {
      const iconSpacingClasses = iconPosition === 'left' ? 'mr-2' : 'ml-2';

      // Si no hay hijos (texto) y si hay icono, el boton es solo un icono
      if (!children && icon) {
        return icon;
      }

      return (
        <>
          {/** Renderizar el icono si esta presente */}
          {icon && iconPosition === 'left' && (
            <span
              className={cn('inline-flex items-center justify-center', {
                'sm:hidden': hideTextOnMobile && children,
                block: !children && icon,
                [iconSpacingClasses]: children,
              })}
            >
              {icon}
            </span>
          )}

          {/** Renderiza el texto (children) */}
          {children && (
            <span
              className={cn({
                'hidden sm:inline': hideTextOnMobile && icon,
              })}
            >
              {children}
            </span>
          )}

          {/** Renderiza el icono si esta presente y el la posicion derecha */}
          {icon && iconPosition === 'right' && (
            <span
              className={cn('inline-flex items-center justify-center', {
                'sm:hidden': hideTextOnMobile && children,
                block: !children && icon,
                [iconSpacingClasses]: children,
              })}
            >
              {icon}
            </span>
          )}
        </>
      );
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          // Ajusta el padding si se muestra el icono en movil
          // No hay texto en el boton completo
          // Prop hideTextOnMobile
          'px-2 w-10': hideTextOnMobile && icon && !children,
          'sm:px-4 sm:w-auto': hideTextOnMobile && icon && !children,
          'px-2': hideTextOnMobile && icon && children,
          'sm:px-4 sm:py-2': hideTextOnMobile && icon && children,
        })}
        ref={ref}
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
