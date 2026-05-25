import { Minus, Plus } from 'lucide-react';
import { cn } from '@utils/cn';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export const QuantitySelector = ({
  value,
  min = 1,
  max = 10,
  onChange,
  className,
}: QuantitySelectorProps) => (
  <div className={cn('flex items-center border border-border', className)}>
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className='flex h-10 w-10 items-center justify-center hover:bg-muted disabled:opacity-40'
    >
      <Minus className='h-4 w-4' />
    </button>
    <span className='flex h-10 w-12 items-center justify-center border-x border-border text-sm font-medium'>
      {value}
    </span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      className='flex h-10 w-10 items-center justify-center hover:bg-muted disabled:opacity-40'
    >
      <Plus className='h-4 w-4' />
    </button>
  </div>
);
