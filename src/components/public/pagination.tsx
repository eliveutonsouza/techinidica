'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const go = useCallback(
    (target: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(target));
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [router, pathname, searchParams],
  );

  if (totalPages <= 1) return null;

  const btnStyle = (disabled: boolean, active = false): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: 8,
    border: `1px solid ${active ? '#2563eb' : disabled ? '#f1f5f9' : '#e2e8f0'}`,
    background: active ? '#2563eb' : disabled ? '#f8fafc' : '#fff',
    color: active ? '#fff' : disabled ? '#cbd5e1' : '#0f172a',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    fontSize: 13,
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  });

  const pages = buildPageRange(page, totalPages);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 40,
        flexWrap: 'wrap',
      }}
    >
      <button
        onClick={() => !( page <= 1) && go(page - 1)}
        style={btnStyle(page <= 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            style={{
              padding: '8px 4px',
              color: '#94a3b8',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 13,
            }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => p !== page && go(p as number)}
            style={btnStyle(false, p === page)}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => !(page >= totalPages) && go(page + 1)}
        style={btnStyle(page >= totalPages)}
        disabled={page >= totalPages}
        aria-label="Próxima página"
      >
        Próxima →
      </button>
    </div>
  );
}

function buildPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
