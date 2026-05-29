'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus('ok');
        setMsg('Inscrito! Você receberá nossas curadoria por e-mail.');
        setEmail('');
      } else {
        setStatus('err');
        setMsg(data.error ?? 'Erro ao inscrever.');
      }
    } catch {
      setStatus('err');
      setMsg('Erro de conexão. Tente novamente.');
    }
  }

  if (status === 'ok') {
    return (
      <div style={{ fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: 13, color: '#86efac', lineHeight: 1.5 }}>
        ✓ {msg}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <p style={{ margin: '0 0 10px', fontFamily: 'Sora, system-ui, sans-serif', fontSize: 13, color: '#fff', fontWeight: 600 }}>
        Curadoria semanal no seu e-mail
      </p>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 13,
            outline: 'none',
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            padding: '8px 14px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? '...' : 'Inscrever'}
        </button>
      </div>
      {status === 'err' && (
        <p style={{ margin: '6px 0 0', fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: 12, color: '#fca5a5' }}>{msg}</p>
      )}
      <p style={{ margin: '6px 0 0', fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: 11, color: '#475569' }}>
        Sem spam. Cancele a qualquer hora. LGPD: apenas seu e-mail é armazenado.
      </p>
    </form>
  );
}
