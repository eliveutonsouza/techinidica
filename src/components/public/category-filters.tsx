'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

type OrdemType = 'nota' | 'preco_asc' | 'desconto' | 'recente';

const ORDENS: { value: OrdemType; label: string }[] = [
  { value: 'nota', label: 'Melhor nota' },
  { value: 'preco_asc', label: 'Menor preço' },
  { value: 'desconto', label: 'Maior desconto' },
  { value: 'recente', label: 'Mais recente' },
];

const btnBase: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 99,
  border: '1px solid #e2e8f0',
  background: '#fff',
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  color: '#475569',
  transition: 'all 0.12s',
  whiteSpace: 'nowrap' as const,
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: '#2563eb',
  borderColor: '#2563eb',
  color: '#fff',
};

export function CategoryFilters({
  total,
}: {
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const plataforma = searchParams.get('plataforma') ?? 'todos';
  const ordem = (searchParams.get('ordem') ?? 'nota') as OrdemType;

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 13,
            color: '#64748b',
            fontWeight: 500,
            marginRight: 4,
          }}
        >
          Plataforma:
        </span>
        {(['todos', 'shopee', 'mercadolivre'] as const).map((p) => (
          <button
            key={p}
            onClick={() => update('plataforma', p)}
            style={plataforma === p ? btnActive : btnBase}
          >
            {p === 'todos' ? 'Todos' : p === 'shopee' ? 'Shopee' : 'Mercado Livre'}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 13,
            color: '#64748b',
            fontWeight: 500,
            marginRight: 4,
          }}
        >
          Ordenar:
        </span>
        {ORDENS.map((o) => (
          <button
            key={o.value}
            onClick={() => update('ordem', o.value)}
            style={ordem === o.value ? btnActive : btnBase}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11.5,
          color: '#94a3b8',
          marginTop: 10,
        }}
      >
        {total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
