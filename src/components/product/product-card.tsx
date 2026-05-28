import Link from 'next/link';
import { ProductBadge } from '@/components/ui/badge';
import { ProductImage } from './product-image';
import type { Produto } from '@/schemas';

export function ProductCard({ produto }: { produto: Produto }) {
  return (
    <Link
      href={`/produto/${produto.id}`}
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ProductImage categoria={produto.categoria} imagemUrl={produto.imagem_url} height={180} rounded={0} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {produto.badge && <ProductBadge kind={produto.badge} />}
          {produto.nota != null && (
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: '#64748b',
              }}
            >
              {Number(produto.nota).toFixed(1)}/10
            </span>
          )}
        </div>
        <h3
          style={{
            margin: 0,
            fontFamily: 'Sora, system-ui, sans-serif',
            fontSize: 15,
            color: '#0f172a',
            lineHeight: 1.4,
          }}
        >
          {produto.nome}
        </h3>
        {produto.descricao_curta && (
          <p
            style={{
              margin: 0,
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 13,
              color: '#64748b',
              lineHeight: 1.5,
            }}
          >
            {produto.descricao_curta}
          </p>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontFamily: 'Sora, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: '#0f172a',
            }}
          >
            R$ {Number(produto.preco_atual).toFixed(2).replace('.', ',')}
          </span>
          {produto.desconto_pct >= 10 && (
            <span
              style={{
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: 12,
                color: '#16a34a',
                fontWeight: 700,
              }}
            >
              -{produto.desconto_pct}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
