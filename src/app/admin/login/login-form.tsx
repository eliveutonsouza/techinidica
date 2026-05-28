'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/actions/auth';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(result.data.redirectTo);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <label
        style={{
          display: 'block',
          color: '#cbd5e1',
          fontSize: 12.5,
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        Senha
      </label>
      <div style={{ position: 'relative' }}>
        <input
          name="password"
          type={show ? 'text' : 'password'}
          required
          autoFocus
          autoComplete="current-password"
          style={{
            width: '100%',
            padding: '10px 36px 10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: '#fff',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: 11,
          }}
        >
          {show ? 'ocultar' : 'mostrar'}
        </button>
      </div>
      {error && (
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 8,
            background: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.3)',
            color: '#fca5a5',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '11px 16px',
          borderRadius: 8,
          border: 'none',
          background: pending ? '#1e3a8a' : '#2563eb',
          color: '#fff',
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontSize: 14,
          fontWeight: 600,
          cursor: pending ? 'wait' : 'pointer',
        }}
      >
        {pending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
