import type { Metadata } from 'next';
import { prisma, serializeDates } from '@/lib/prisma';
import { ProdutoSchema, CategoriaSchema, type Produto, type Categoria } from '@/schemas';
import { ProductCard } from '@/components/product/product-card';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';
import { SearchBox } from './search-box';

type SearchParams = Promise<{ q?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Busca: ${q}` : 'Busca de produtos',
    description: q
      ? `Resultados de busca para "${q}" no TechIndica.`
      : 'Encontre o melhor produto de tecnologia com curadoria técnica.',
    robots: { index: false, follow: true },
  };
}

async function search(q: string): Promise<Produto[]> {
  if (!q.trim()) return [];
  const term = q.trim();
  const rows = await prisma.produto.findMany({
    where: {
      publicado: true,
      OR: [
        { nome: { contains: term, mode: 'insensitive' } },
        { descricao_curta: { contains: term, mode: 'insensitive' } },
      ],
    },
    orderBy: { nota: 'desc' },
    take: 24,
  });
  return rows
    .map((p) => ProdutoSchema.safeParse(serializeDates(p)))
    .filter((r) => r.success)
    .map((r) => r.data as Produto);
}

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q = '' } = await searchParams;
  const [resultados, catsRaw] = await Promise.all([
    search(q),
    prisma.categoria.findMany({ orderBy: { ordem: 'asc' } }),
  ]);
  const categorias = catsRaw
    .map((c) => CategoriaSchema.safeParse(serializeDates(c)))
    .filter((r) => r.success)
    .map((r) => r.data as Categoria);

  return (
    <>
      <PublicHeader categorias={categorias} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1
          style={{
            fontFamily: 'Sora, system-ui, sans-serif',
            fontSize: 28,
            margin: '0 0 24px',
            color: '#0f172a',
            letterSpacing: -0.5,
          }}
        >
          Busca
        </h1>

        <SearchBox initialQ={q} />

        {q && (
          <p
            style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 13,
              color: '#64748b',
              margin: '12px 0 24px',
            }}
          >
            {resultados.length === 0
              ? `Nenhum resultado para "${q}".`
              : `${resultados.length} resultado${resultados.length === 1 ? '' : 's'} para "${q}"`}
          </p>
        )}

        {resultados.length > 0 && (
          <div className="grid-3col">
            {resultados.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        )}

        {q && resultados.length === 0 && (
          <div
            style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: 14,
              padding: 40,
              textAlign: 'center',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              color: '#64748b',
            }}
          >
            <p style={{ margin: '0 0 16px', fontSize: 15 }}>
              Tente buscar por categoria:
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {categorias.map((c) => (
                <a
                  key={c.slug}
                  href={`/categoria/${c.slug}`}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 99,
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {c.nome}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
      <PublicFooter categorias={categorias} />
    </>
  );
}
