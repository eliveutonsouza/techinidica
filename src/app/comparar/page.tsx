import type { Metadata } from 'next';
import { prisma, serializeDates } from '@/lib/prisma';
import { ProdutoSchema, CategoriaSchema, type Produto, type Categoria } from '@/schemas';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';
import { BuyButtons } from '@/components/product/buy-buttons';
import { ProductImage } from '@/components/product/product-image';
import { ProductBadge } from '@/components/ui/badge';
import { AffiliateDisclosure } from '@/components/product/affiliate-disclosure';

export const metadata: Metadata = {
  title: 'Comparador de produtos',
  description: 'Compare dois produtos de tecnologia lado a lado com ficha técnica completa.',
};

type SearchParams = Promise<{ a?: string; b?: string }>;

async function loadProdutos(ids: number[]): Promise<Map<number, Produto>> {
  if (ids.length === 0) return new Map();
  const rows = await prisma.produto.findMany({
    where: { id: { in: ids }, publicado: true },
  });
  const map = new Map<number, Produto>();
  for (const row of rows) {
    const r = ProdutoSchema.safeParse(serializeDates(row));
    if (r.success) map.set(r.data.id, r.data);
  }
  return map;
}

export default async function CompararPage({ searchParams }: { searchParams: SearchParams }) {
  const { a, b } = await searchParams;
  const idA = a ? parseInt(a, 10) : null;
  const idB = b ? parseInt(b, 10) : null;

  const catsRaw = await prisma.categoria.findMany({ orderBy: { ordem: 'asc' } });
  const categorias = catsRaw
    .map((c) => CategoriaSchema.safeParse(serializeDates(c)))
    .filter((r) => r.success)
    .map((r) => r.data as Categoria);

  const ids = [idA, idB].filter((x): x is number => x !== null && !isNaN(x));
  const map = await loadProdutos(ids);
  const pA = idA ? map.get(idA) ?? null : null;
  const pB = idB ? map.get(idB) ?? null : null;

  const allSpecs = new Set<string>([
    ...(pA ? Object.keys(pA.specs ?? {}) : []),
    ...(pB ? Object.keys(pB.specs ?? {}) : []),
  ]);

  return (
    <>
      <PublicHeader categorias={categorias} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1
          style={{
            fontFamily: 'Sora, system-ui, sans-serif',
            fontSize: 28,
            margin: '0 0 8px',
            color: '#0f172a',
            letterSpacing: -0.5,
          }}
        >
          Comparador de produtos
        </h1>
        <p
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 14,
            color: '#64748b',
            margin: '0 0 32px',
          }}
        >
          Selecione dois produtos nas páginas de categoria e clique em "Comparar".
        </p>

        {(!pA && !pB) ? (
          <EmptyComparator categorias={categorias} />
        ) : (
          <>
            <AffiliateDisclosure />

            {/* Product headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr 1fr',
                gap: 16,
                marginTop: 24,
                marginBottom: 0,
              }}
            >
              <div />
              <ProdutoHeader produto={pA} label="Produto A" />
              <ProdutoHeader produto={pB} label="Produto B" />
            </div>

            {/* Comparison rows */}
            <ComparisonRow label="Preço" a={pA ? `R$ ${Number(pA.preco_atual).toFixed(2).replace('.', ',')}` : '—'} b={pB ? `R$ ${Number(pB.preco_atual).toFixed(2).replace('.', ',')}` : '—'} highlight="lower" numA={pA?.preco_atual} numB={pB?.preco_atual} />
            <ComparisonRow label="Desconto" a={pA ? `${pA.desconto_pct}%` : '—'} b={pB ? `${pB.desconto_pct}%` : '—'} highlight="higher" numA={pA?.desconto_pct} numB={pB?.desconto_pct} />
            <ComparisonRow label="Nota TechIndica" a={pA?.nota != null ? `${Number(pA.nota).toFixed(1)}/10` : '—'} b={pB?.nota != null ? `${Number(pB.nota).toFixed(1)}/10` : '—'} highlight="higher" numA={pA?.nota ?? undefined} numB={pB?.nota ?? undefined} />
            <ComparisonRow label="Plataforma" a={pA?.plataforma ?? '—'} b={pB?.plataforma ?? '—'} />

            {/* Specs */}
            {allSpecs.size > 0 && (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr 1fr',
                    gap: 16,
                    marginTop: 8,
                    padding: '10px 12px',
                    background: '#0f172a',
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontFamily: 'Sora, system-ui', fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>Especificação</span>
                  <span style={{ fontFamily: 'Sora, system-ui', fontSize: 12, fontWeight: 700, color: '#fff' }}>{pA?.nome ?? 'Produto A'}</span>
                  <span style={{ fontFamily: 'Sora, system-ui', fontSize: 12, fontWeight: 700, color: '#fff' }}>{pB?.nome ?? 'Produto B'}</span>
                </div>
                {Array.from(allSpecs).map((k) => (
                  <ComparisonRow
                    key={k}
                    label={k}
                    a={pA?.specs?.[k] ?? '—'}
                    b={pB?.specs?.[k] ?? '—'}
                  />
                ))}
              </>
            )}

            {/* Pros/Contras */}
            {((pA && pA.pros.length > 0) || (pB && pB.pros.length > 0)) && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr 1fr',
                  gap: 16,
                  marginTop: 24,
                  alignItems: 'start',
                }}
              >
                <span style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 14, color: '#0f172a', paddingTop: 4 }}>Prós</span>
                <ProsContrasList items={pA?.pros ?? []} color="#15803d" />
                <ProsContrasList items={pB?.pros ?? []} color="#15803d" />
              </div>
            )}
            {((pA && pA.contras.length > 0) || (pB && pB.contras.length > 0)) && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr 1fr',
                  gap: 16,
                  marginTop: 16,
                  alignItems: 'start',
                }}
              >
                <span style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 14, color: '#0f172a', paddingTop: 4 }}>Contras</span>
                <ProsContrasList items={pA?.contras ?? []} color="#b91c1c" />
                <ProsContrasList items={pB?.contras ?? []} color="#b91c1c" />
              </div>
            )}

            {/* Buy buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr 1fr',
                gap: 16,
                marginTop: 32,
              }}
            >
              <div />
              <div>{pA && <BuyButtons produto={pA} size="md" />}</div>
              <div>{pB && <BuyButtons produto={pB} size="md" />}</div>
            </div>
          </>
        )}
      </main>
      <PublicFooter categorias={categorias} />
    </>
  );
}

function ProdutoHeader({ produto, label }: { produto: Produto | null; label: string }) {
  if (!produto) {
    return (
      <div
        style={{
          border: '1px dashed #cbd5e1',
          borderRadius: 12,
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 180,
          color: '#94a3b8',
          fontFamily: 'DM Sans, system-ui',
          fontSize: 13,
        }}
      >
        {label} não selecionado
      </div>
    );
  }
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' }}>
      <ProductImage categoria={produto.categoria} imagemUrl={produto.imagem_url} height={140} rounded={8} />
      <div style={{ marginTop: 10 }}>
        {produto.badge && <ProductBadge kind={produto.badge} />}
        <h3 style={{ fontFamily: 'Sora, system-ui', fontSize: 14, color: '#0f172a', margin: '8px 0 4px', lineHeight: 1.4 }}>{produto.nome}</h3>
      </div>
    </div>
  );
}

function ComparisonRow({
  label, a, b, highlight, numA, numB,
}: {
  label: string;
  a: string;
  b: string;
  highlight?: 'lower' | 'higher';
  numA?: number | null;
  numB?: number | null;
}) {
  const aWins = highlight && numA != null && numB != null
    ? (highlight === 'lower' ? numA < numB : numA > numB)
    : false;
  const bWins = highlight && numA != null && numB != null
    ? (highlight === 'lower' ? numB < numA : numB > numA)
    : false;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 1fr',
        gap: 16,
        borderBottom: '1px solid #f1f5f9',
        padding: '10px 12px',
      }}
    >
      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: aWins ? '#15803d' : '#0f172a', fontWeight: aWins ? 700 : 400, background: aWins ? '#dcfce7' : 'transparent', borderRadius: 6, padding: '2px 6px', alignSelf: 'start' }}>{a}</span>
      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: bWins ? '#15803d' : '#0f172a', fontWeight: bWins ? 700 : 400, background: bWins ? '#dcfce7' : 'transparent', borderRadius: 6, padding: '2px 6px', alignSelf: 'start' }}>{b}</span>
    </div>
  );
}

function ProsContrasList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#334155', marginBottom: 6, paddingLeft: 16, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 0, color, fontWeight: 700 }}>·</span>
          {item}
        </li>
      ))}
      {items.length === 0 && <li style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#94a3b8' }}>—</li>}
    </ul>
  );
}

function EmptyComparator({ categorias }: { categorias: Categoria[] }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 15, color: '#64748b', marginBottom: 24 }}>
        Nenhum produto selecionado. Navegue para uma categoria e clique em "Comparar" em dois produtos.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {categorias.map((c) => (
          <a
            key={c.slug}
            href={`/categoria/${c.slug}`}
            style={{
              padding: '8px 16px',
              borderRadius: 99,
              background: '#eff6ff',
              color: '#1d4ed8',
              textDecoration: 'none',
              fontFamily: 'DM Sans, system-ui',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {c.nome}
          </a>
        ))}
      </div>
    </div>
  );
}
