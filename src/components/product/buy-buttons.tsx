'use client';

import type { Produto } from '@/schemas';

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
  }
}

function trackAffiliate(platform: string, productName: string) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('affiliate_click', { props: { platform, product: productName } });
  }
}

export function BuyButtons({ produto, size = 'md' }: { produto: Produto; size?: 'sm' | 'md' }) {
  const padding = size === 'md' ? '12px 18px' : '8px 12px';
  const fontSize = size === 'md' ? 14 : 12.5;

  const items: { href: string | null; bg: string; fg: string; label: string; platform: string }[] = [
    { href: produto.link_shopee, bg: '#f05d23', fg: '#fff', label: 'Comprar na Shopee', platform: 'shopee' },
    { href: produto.link_mercadolivre, bg: '#fff159', fg: '#333', label: 'Mercado Livre', platform: 'mercadolivre' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it) =>
        it.href ? (
          <a
            key={it.platform}
            href={it.href}
            target="_blank"
            rel="nofollow sponsored noopener"
            onClick={() => trackAffiliate(it.platform, produto.nome)}
            style={{
              background: it.bg,
              color: it.fg,
              padding,
              borderRadius: 8,
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize,
              fontWeight: 700,
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block',
            }}
          >
            {it.label}
          </a>
        ) : null,
      )}
    </div>
  );
}
