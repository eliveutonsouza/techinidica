'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/schemas';
import { togglePostPublicado, deletePost } from '@/actions/generate-post';
import { Icon } from '@/components/ui/icon';
import { fonts, colors, dangerBtn, ghostBtn } from '@/components/ui/styles';

export function PostsTable({ initial }: { initial: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initial);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function onToggle(id: number, value: boolean) {
    setPendingId(id);
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, publicado: value } : x)));
    startTransition(async () => {
      const r = await togglePostPublicado(id, value);
      setPendingId(null);
      if (!r.ok) {
        setPosts((p) => p.map((x) => (x.id === id ? { ...x, publicado: !value } : x)));
      }
      router.refresh();
    });
  }

  function onDelete(id: number) {
    if (!confirm('Deletar este post? Acao irreversivel.')) return;
    setPendingId(id);
    startTransition(async () => {
      const r = await deletePost(id);
      setPendingId(null);
      if (r.ok) {
        setPosts((p) => p.filter((x) => x.id !== id));
      }
      router.refresh();
    });
  }

  if (posts.length === 0) {
    return (
      <div
        style={{
          background: '#fff',
          border: '1px dashed #cbd5e1',
          borderRadius: 14,
          padding: 48,
          textAlign: 'center',
          fontFamily: fonts.body,
          color: colors.muted,
        }}
      >
        Nenhum post gerado ainda. Va para{' '}
        <Link href="/admin/automacao" style={{ color: '#2563eb' }}>
          Automacao
        </Link>{' '}
        e clique em <strong>Gerar post agora</strong>.
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fonts.body, fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
            {['Post', 'Angulo', 'Itens', 'Fonte', 'Publicado', 'Criado', 'Acoes'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '11px 16px',
                  fontFamily: fonts.mono,
                  fontSize: 10.5,
                  color: colors.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 16px', maxWidth: 360 }}>
                <Link
                  href={`/post/${post.slug}`}
                  target="_blank"
                  style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}
                >
                  {post.titulo}
                </Link>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 2 }}>
                  /post/{post.slug}
                </div>
              </td>
              <td style={{ padding: '12px 16px', color: colors.muted, fontSize: 12, maxWidth: 220 }}>
                {post.angulo}
              </td>
              <td style={{ padding: '12px 16px' }}>{post.itens.length}</td>
              <td style={{ padding: '12px 16px' }}>
                <span
                  style={{
                    background: post.fonte === 'cron' ? '#dbeafe' : '#fef3c7',
                    color: post.fonte === 'cron' ? '#1e40af' : '#a16207',
                    padding: '2px 8px',
                    borderRadius: 99,
                    fontSize: 11,
                    fontFamily: fonts.mono,
                    fontWeight: 600,
                  }}
                >
                  {post.fonte}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <button
                  onClick={() => onToggle(post.id, !post.publicado)}
                  disabled={pendingId === post.id}
                  style={{
                    border: 'none',
                    background: post.publicado ? '#16a34a' : '#94a3b8',
                    color: '#fff',
                    width: 36,
                    height: 20,
                    borderRadius: 99,
                    position: 'relative',
                    cursor: 'pointer',
                    opacity: pendingId === post.id ? 0.5 : 1,
                  }}
                  aria-label={post.publicado ? 'Despublicar' : 'Publicar'}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: post.publicado ? 18 : 2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'left 0.15s',
                    }}
                  />
                </button>
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  color: colors.muted,
                }}
              >
                {new Date(post.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                })}
              </td>
              <td style={{ padding: '12px 16px', display: 'flex', gap: 6 }}>
                <Link
                  href={`/post/${post.slug}`}
                  target="_blank"
                  style={{ ...ghostBtn, padding: '6px 10px', fontSize: 12 }}
                >
                  <Icon name="externalLink" size={12} />
                  Ver
                </Link>
                <button
                  onClick={() => onDelete(post.id)}
                  disabled={pendingId === post.id}
                  style={{ ...dangerBtn, padding: '6px 10px', fontSize: 12 }}
                >
                  <Icon name="trash" size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
