import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className='flex flex-col gap-1.5'>
        {label && (
          <label htmlFor={inputId} className='text-sm font-medium text-text'>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded border bg-background px-3 text-sm text-text placeholder:text-text-muted transition-colors',
            'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
            error
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-border',
            className,
          )}
          {...props}
        />
        {error && <p className='text-xs text-error'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
