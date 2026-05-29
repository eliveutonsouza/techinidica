import Link from 'next/link';
import type { Categoria } from '@/schemas';
import { HeaderSearch } from './header-search';

export function PublicHeader({ categorias }: { categorias: Categoria[] }) {
  const main = categorias.slice(0, 4);
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'Sora, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            color: '#0f172a',
            textDecoration: 'none',
            letterSpacing: -0.5,
          }}
        >
          Tech<span style={{ color: '#2563eb' }}>Indica</span>
        </Link>
        <nav className="header-nav-links">
          <Link
            href="/"
            style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 14,
              color: '#0f172a',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Home
          </Link>
          {main.map((c) => (
            <Link
              key={c.slug}
              href={`/categoria/${c.slug}`}
              style={{
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: 14,
                color: '#475569',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {c.nome}
            </Link>
          ))}
        </nav>
        <HeaderSearch />
      </div>
    </header>
  );
}
