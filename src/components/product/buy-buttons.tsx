import type { Produto } from '@/schemas';

export function BuyButtons({ produto, size = 'md' }: { produto: Produto; size?: 'sm' | 'md' }) {
  const padding = size === 'md' ? '12px 18px' : '8px 12px';
  const fontSize = size === 'md' ? 14 : 12.5;
  const items: { href: string | null; bg: string; fg: string; label: string }[] = [
    { href: produto.link_shopee, bg: '#f05d23', fg: '#fff', label: 'Comprar na Shopee' },
    { href: produto.link_mercadolivre, bg: '#fff159', fg: '#333', label: 'Mercado Livre' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it, i) =>
        it.href ? (
          <a
            key={i}
            href={it.href}
            target="_blank"
            rel="nofollow sponsored noopener"
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
