'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'techindica_compare';

function getSelected(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function setSelected(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function CompareButton({ produtoId }: { produtoId: number }) {
  const router = useRouter();
  const [selected, setSelectedState] = useState<number[]>([]);

  useEffect(() => {
    setSelectedState(getSelected());
    const onStorage = () => setSelectedState(getSelected());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isSelected = selected.includes(produtoId);

  function toggle() {
    const current = getSelected();
    if (current.includes(produtoId)) {
      const next = current.filter((id) => id !== produtoId);
      setSelected(next);
      setSelectedState(next);
    } else {
      if (current.length >= 2) {
        const next = [current[1], produtoId];
        setSelected(next);
        setSelectedState(next);
      } else {
        const next = [...current, produtoId];
        setSelected(next);
        setSelectedState(next);
        if (next.length === 2) {
          router.push(`/comparar?a=${next[0]}&b=${next[1]}`);
        }
      }
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      title={isSelected ? 'Remover da comparação' : 'Adicionar à comparação'}
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 8,
        border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
        background: isSelected ? '#eff6ff' : 'rgba(255,255,255,0.9)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        color: isSelected ? '#2563eb' : '#94a3b8',
        backdropFilter: 'blur(4px)',
        zIndex: 2,
      }}
    >
      {isSelected ? '✓' : '⇄'}
    </button>
  );
}
