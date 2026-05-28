'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { runShopeeFetch } from '@/actions/shopee-fetch';
import { Icon } from '@/components/ui/icon';
import { primaryAdminBtn, fonts, colors } from '@/components/ui/styles';

export function AutomacaoControls() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { ok: true; encontrados: number; novos: number; atualizados: number } | { ok: false; error: string } | null
  >(null);

  function runShopee() {
    setResult(null);
    startTransition(async () => {
      const r = await runShopeeFetch();
      if (!r.ok) {
        setResult({ ok: false, error: r.error });
        return;
      }
      setResult({ ok: true, ...r.data });
      router.refresh();
    });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #f05d23, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: fonts.sora,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            S
          </span>
          <div>
            <h3 style={{ margin: 0, fontFamily: fonts.sora, fontWeight: 600, fontSize: 16, color: colors.fg }}>
              Shopee
            </h3>
            <div style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>
              API GraphQL · HMAC-SHA1
            </div>
          </div>
        </div>

        {result && result.ok === true && (
          <div
            style={{
              background: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
              fontFamily: fonts.body,
              fontSize: 13,
              color: '#15803d',
            }}
          >
            <strong>Concluido</strong> · {result.encontrados} encontrados · {result.novos} novos · {result.atualizados} atualizados
          </div>
        )}
        {result && result.ok === false && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
              fontFamily: fonts.body,
              fontSize: 13,
              color: '#991b1b',
            }}
          >
            <strong>Erro:</strong> {result.error}
          </div>
        )}

        <button
          onClick={runShopee}
          disabled={pending}
          style={{
            ...primaryAdminBtn,
            background: '#f05d23',
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? (
            <Icon name="refresh" size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Icon name="play" size={14} />
          )}
          {pending ? 'Coletando...' : 'Buscar agora'}
        </button>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: 20,
          opacity: 0.6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #fff159, #facc15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
              fontFamily: fonts.sora,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ML
          </span>
          <div>
            <h3 style={{ margin: 0, fontFamily: fonts.sora, fontWeight: 600, fontSize: 16, color: colors.fg }}>
              Mercado Livre
            </h3>
            <div style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>
              Pos-MVP
            </div>
          </div>
        </div>
        <div
          style={{
            background: '#f8fafc',
            borderRadius: 10,
            padding: 18,
            textAlign: 'center',
            border: '1px dashed #cbd5e1',
            fontFamily: fonts.body,
            fontSize: 13,
            color: colors.muted,
          }}
        >
          Disponivel apos o MVP.
        </div>
      </div>
    </div>
  );
}
