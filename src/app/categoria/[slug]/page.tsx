import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
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
  const supabase = await createClient();
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from('produtos')
    .select('*', { count: 'exact' })
    .eq('publicado', true)
    .eq('categoria', slug);

  if (plataforma === 'shopee') query = query.not('link_shopee', 'is', null);
  else if (plataforma === 'mercadolivre') query = query.not('link_mercadolivre', 'is', null);

  if (ordem === 'preco_asc') query = query.order('preco_atual', { ascending: true });
  else if (ordem === 'desconto') query = query.order('desconto_pct', { ascending: false });
  else if (ordem === 'recente') query = query.order('created_at', { ascending: false });
  else query = query.order('nota', { ascending: false });

  query = query.range(offset, offset + PAGE_SIZE - 1);

  const [catRes, prodRes, allCatsRes] = await Promise.all([
    supabase.from('categorias').select('*').eq('slug', slug).maybeSingle(),
    query,
    supabase.from('categorias').select('*').order('ordem'),
  ]);

  const catParsed = catRes.data ? CategoriaSchema.safeParse(catRes.data) : null;
  const produtos = (prodRes.data ?? [])
    .map((p) => ProdutoSchema.safeParse(p))
    .filter((r) => r.success)
    .map((r) => r.data as Produto);
  const todas = (allCatsRes.data ?? [])
    .map((c) => CategoriaSchema.safeParse(c))
    .filter((r) => r.success)
    .map((r) => r.data as Categoria);

  return {
    categoria: catParsed?.success ? catParsed.data : null,
    produtos,
    total: prodRes.count ?? 0,
    todas,
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('categorias').select('nome').eq('slug', slug).maybeSingle();
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
