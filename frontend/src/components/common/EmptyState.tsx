import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-4 py-16 text-center',
      className,
    )}
  >
    {icon && <div className='text-gray-300'>{icon}</div>}
    <div>
      <h3 className='text-lg font-semibold text-text'>{title}</h3>
      {description && (
        <p className='mt-1 text-sm text-text-muted'>{description}</p>
      )}
    </div>
    {action}
  </div>
);
