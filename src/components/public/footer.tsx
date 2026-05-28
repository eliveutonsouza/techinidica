import Link from 'next/link';
import type { Categoria } from '@/schemas';
import { AffiliateDisclosure } from '@/components/product/affiliate-disclosure';

export function PublicFooter({ categorias }: { categorias: Categoria[] }) {
  return (
    <footer
      style={{
        marginTop: 80,
        background: '#0f172a',
        color: '#cbd5e1',
        padding: '40px 24px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: 32,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'Sora, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: '#fff',
              marginBottom: 8,
            }}
          >
            Tech<span style={{ color: '#60a5fa' }}>Indica</span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 13,
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: 380,
            }}
          >
            Curadoria de produtos de tecnologia com recomendacoes honestas. Monetizado por
            links de afiliado Shopee e Mercado Livre.
          </p>
          <div style={{ marginTop: 16 }}>
            <AffiliateDisclosure />
          </div>
        </div>
        <div>
          <h4
            style={{
              fontFamily: 'Sora, system-ui, sans-serif',
              fontSize: 13,
              color: '#fff',
              margin: '0 0 12px',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Categorias
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {categorias.map((c) => (
              <li key={c.slug} style={{ marginBottom: 6 }}>
                <Link
                  href={`/categoria/${c.slug}`}
                  style={{
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    fontSize: 13,
                    color: '#cbd5e1',
                    textDecoration: 'none',
                  }}
                >
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4
            style={{
              fontFamily: 'Sora, system-ui, sans-serif',
              fontSize: 13,
              color: '#fff',
              margin: '0 0 12px',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Sobre
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontSize: 13,
                  color: '#94a3b8',
                }}
              >
                MVP em construcao
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div
        style={{
          maxWidth: 1200,
          margin: '32px auto 0',
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: '#64748b',
        }}
      >
        <span>(C) {new Date().getFullYear()} TechIndica</span>
        <span>v0.2.0</span>
      </div>
    </footer>
  );
}
