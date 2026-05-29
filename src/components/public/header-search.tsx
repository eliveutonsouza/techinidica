'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function HeaderSearch() {
  const [q, setQ] = useState('');
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/busca?q=${encodeURIComponent(q.trim())}`);
      setQ('');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar..."
        style={{
          width: 160,
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontSize: 13,
          color: '#0f172a',
          outline: 'none',
          background: '#f8fafc',
        }}
      />
      <button
        type="submit"
        aria-label="Buscar"
        style={{
          padding: '6px 10px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        🔍
      </button>
    </form>
  );
}
