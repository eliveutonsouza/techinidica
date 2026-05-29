import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { prisma, serializeDates } from '@/lib/prisma';
import { type Prisma } from '@prisma/client';
import { ProdutoSchema, CategoriaSchema, type Produto, type Categoria } from '@/schemas';
import { ProductCard } from '@/components/product/product-card';
import { AffiliateDisclosure } from '@/components/product/affiliate-disclosure';
import { CategoryFilters } from '@/components/public/category-filters';
import { Pagination } from '@/components/public/pagination';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';

export const revalidate = 60;

const PAGE_SIZE = 10;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{
  plataforma?: string;
  ordem?: string;
  page?: string;
}>;

async function load(
  slug: string,
  plataforma: string,
  ordem: string,
  page: number,
): Promise<{
  categoria: Categoria | null;
  produtos: Produto[];
  total: number;
  todas: Categoria[];
}> {
  const offset = (page - 1) * PAGE_SIZE;

  const where: Prisma.ProdutoWhereInput = {
    publicado: true,
    categoria: slug,
    ...(plataforma === 'shopee' ? { link_shopee: { not: null } } : {}),
    ...(plataforma === 'mercadolivre' ? { link_mercadolivre: { not: null } } : {}),
  };

  const orderBy: Prisma.ProdutoOrderByWithRelationInput =
    ordem === 'preco_asc' ? { preco_atual: 'asc' } :
    ordem === 'desconto'  ? { desconto_pct: 'desc' } :
    ordem === 'recente'   ? { created_at: 'desc' } :
    { nota: 'desc' };

  const [catRaw, prodRaw, total, todasRaw] = await prisma.$transaction([
    prisma.categoria.findUnique({ where: { slug } }),
    prisma.produto.findMany({ where, orderBy, skip: offset, take: PAGE_SIZE }),
    prisma.produto.count({ where }),
    prisma.categoria.findMany({ orderBy: { ordem: 'asc' } }),
  ]);

  const catParsed = catRaw ? CategoriaSchema.safeParse(serializeDates(catRaw)) : null;
  const produtos = prodRaw
    .map((p) => ProdutoSchema.safeParse(serializeDates(p)))
    .filter((r) => r.success)
    .map((r) => r.data as Produto);
  const todas = todasRaw
    .map((c) => CategoriaSchema.safeParse(serializeDates(c)))
    .filter((r) => r.success)
    .map((r) => r.data as Categoria);

  return {
    categoria: catParsed?.success ? catParsed.data : null,
    produtos,
    total,
    todas,
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await prisma.categoria.findUnique({ where: { slug }, select: { nome: true } });
  if (!data) return { title: 'Categoria' };
  const year = new Date().getFullYear();
  return {
    title: `Melhores ${data.nome} para comprar em ${year}`,
    description: `Os melhores ${data.nome} avaliados por especificações técnicas reais. Veja ficha técnica, prós, contras e compare preços na Shopee e Mercado Livre.`,
    openGraph: {
      title: `Melhores ${data.nome} para comprar em ${year} — TechIndica`,
      description: `Curadoria técnica honesta dos melhores ${data.nome}. Análise de custo-benefício com especificações reais.`,
    },
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { plataforma = 'todos', ordem = 'nota', page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);

  const { categoria, produtos, total, todas } = await load(slug, plataforma, ordem, page);
  if (!categoria) notFound();

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <PublicHeader categorias={todas} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <nav
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 13,
            color: '#64748b',
            marginBottom: 12,
          }}
        >
          <a href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</a>
          {' / '}
          <span style={{ color: '#0f172a' }}>{categoria.nome}</span>
        </nav>
        <h1
          style={{
            fontFamily: 'Sora, system-ui, sans-serif',
            fontSize: 32,
            margin: '0 0 24px',
            color: '#0f172a',
            letterSpacing: -0.5,
          }}
        >
          {categoria.nome}
        </h1>

        <div style={{ marginBottom: 20 }}>
          <AffiliateDisclosure />
        </div>

        <Suspense>
          <CategoryFilters total={total} />
        </Suspense>

        {produtos.length === 0 ? (
          <div
            style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: 14,
              padding: 40,
              textAlign: 'center',
              color: '#64748b',
              fontFamily: 'DM Sans, system-ui, sans-serif',
            }}
          >
            Nenhum produto encontrado com estes filtros.
          </div>
        ) : (
          <div className="grid-3col">
            {produtos.map((p, i) => (
              <ProductCard key={p.id} produto={p} position={(page - 1) * PAGE_SIZE + i + 1} />
            ))}
          </div>
        )}

        <Suspense>
          <Pagination page={page} totalPages={totalPages} />
        </Suspense>
      </main>
      <PublicFooter categorias={todas} />
    </>
  );
}
