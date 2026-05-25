import type { HTMLAttributes } from 'react';
import { cn } from '@utils/cn';

type SeparatorProps = HTMLAttributes<HTMLHRElement>;

export function Separator({ className, ...props }: SeparatorProps) {
  return <hr className={cn('border-t border-border', className)} {...props} />;
}
