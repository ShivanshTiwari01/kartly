import { cn } from '@utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = buildPageRange(page, totalPages);

  return (
    <nav
      role='navigation'
      aria-label='Pagination'
      className={cn('flex items-center gap-1', className)}
    >
      <PageButton
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label='Previous page'
      >
        <ChevronLeft className='h-4 w-4' />
      </PageButton>

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className='flex h-9 w-9 items-center justify-center text-sm text-text-muted'
          >
            …
          </span>
        ) : (
          <PageButton
            key={p}
            onClick={() => onPageChange(p as number)}
            active={p === page}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </PageButton>
        ),
      )}

      <PageButton
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label='Next page'
      >
        <ChevronRight className='h-4 w-4' />
      </PageButton>
    </nav>
  );
}

interface PageButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
}

function PageButton({
  onClick,
  disabled,
  active,
  children,
  ...aria
}: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded text-sm font-medium transition-colors',
        'disabled:pointer-events-none disabled:opacity-40',
        active
          ? 'bg-primary text-white'
          : 'border border-border hover:bg-muted text-text',
      )}
      {...aria}
    >
      {children}
    </button>
  );
}

function buildPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const delta = 2;
  const left = current - delta;
  const right = current + delta;
  const pages: (number | '...')[] = [];

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = Math.max(2, left); i <= Math.min(total - 1, right); i++) {
    pages.push(i);
  }
  if (right < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}
