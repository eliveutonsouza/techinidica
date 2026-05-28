'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { runShopeeFetch } from '@/actions/shopee-fetch';
import { generatePost } from '@/actions/generate-post';
import { Icon } from '@/components/ui/icon';
import { primaryAdminBtn, fonts, colors } from '@/components/ui/styles';

type ShopeeResult =
  | { ok: true; encontrados: number; novos: number; atualizados: number }
  | { ok: false; error: string }
  | null;

type PostResult =
  | { ok: true; post_id: number; slug: string; titulo: string; itens: number }
  | { ok: false; error: string }
  | null;

export function AutomacaoControls() {
  const router = useRouter();
  const [pendingShopee, startShopee] = useTransition();
  const [pendingPost, startPost] = useTransition();
  const [shopeeResult, setShopeeResult] = useState<ShopeeResult>(null);
  const [postResult, setPostResult] = useState<PostResult>(null);

  function runShopee() {
    setShopeeResult(null);
    startShopee(async () => {
      const r = await runShopeeFetch();
      if (!r.ok) {
        setShopeeResult({ ok: false, error: r.error });
        return;
      }
      setShopeeResult({ ok: true, ...r.data });
      router.refresh();
    });
  }

  function runGeneratePost() {
    setPostResult(null);
    startPost(async () => {
      const r = await generatePost('manual');
      if (!r.ok) {
        setPostResult({ ok: false, error: r.error });
        return;
      }
      setPostResult({ ok: true, ...r.data });
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

        {shopeeResult && shopeeResult.ok === true && (
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
            <strong>Concluido</strong> · {shopeeResult.encontrados} encontrados · {shopeeResult.novos} novos · {shopeeResult.atualizados} atualizados
          </div>
        )}
        {shopeeResult && shopeeResult.ok === false && (
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
            <strong>Erro:</strong> {shopeeResult.error}
          </div>
        )}

        <button
          onClick={runShopee}
          disabled={pendingShopee}
          style={{
            ...primaryAdminBtn,
            background: '#f05d23',
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            opacity: pendingShopee ? 0.7 : 1,
          }}
        >
          {pendingShopee ? (
            <Icon name="refresh" size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Icon name="play" size={14} />
          )}
          {pendingShopee ? 'Coletando...' : 'Buscar agora'}
        </button>
      </div>

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
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Icon name="sparkles" size={18} />
          </span>
          <div>
            <h3 style={{ margin: 0, fontFamily: fonts.sora, fontWeight: 600, fontSize: 16, color: colors.fg }}>
              Post curado (Top 5-10)
            </h3>
            <div style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>
              Coleta + GPT-4o escolhe angulo e escreve
            </div>
          </div>
        </div>

        {postResult && postResult.ok === true && (
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
            <strong>Post criado:</strong> {postResult.titulo} · {postResult.itens} itens ·{' '}
            <Link href={`/post/${postResult.slug}`} target="_blank" style={{ color: '#15803d', textDecoration: 'underline' }}>
              ver
            </Link>
          </div>
        )}
        {postResult && postResult.ok === false && (
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
            <strong>Erro:</strong> {postResult.error}
          </div>
        )}

        <button
          onClick={runGeneratePost}
          disabled={pendingPost}
          style={{
            ...primaryAdminBtn,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            opacity: pendingPost ? 0.7 : 1,
          }}
        >
          {pendingPost ? (
            <Icon name="refresh" size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Icon name="sparkles" size={14} />
          )}
          {pendingPost ? 'Curando...' : 'Gerar post agora'}
        </button>
      </div>
    </div>
  );
}
