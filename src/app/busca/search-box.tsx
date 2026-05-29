'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

export function SearchBox({ initialQ }: { initialQ: string }) {
  const [q, setQ] = useState(initialQ);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/busca?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, maxWidth: 560 }}>
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ex: smartwatch barato, fone sem fio..."
        autoFocus
        style={{
          flex: 1,
          padding: '11px 16px',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontSize: 14,
          color: '#0f172a',
          outline: 'none',
          background: '#fff',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '11px 20px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Buscar
      </button>
    </form>
  );
}
