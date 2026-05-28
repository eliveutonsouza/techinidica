import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProdutoSchema, CategoriaSchema, type Produto, type Categoria } from '@/schemas';
import { ProductCard } from '@/components/product/product-card';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

async function load(slug: string): Promise<{
  categoria: Categoria | null;
  produtos: Produto[];
  todas: Categoria[];
}> {
  const supabase = await createClient();
  const [catRes, prodRes, allCatsRes] = await Promise.all([
    supabase.from('categorias').select('*').eq('slug', slug).maybeSingle(),
    supabase
      .from('produtos')
      .select('*')
      .eq('publicado', true)
      .eq('categoria', slug)
      .order('updated_at', { ascending: false }),
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
    todas,
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('categorias').select('nome').eq('slug', slug).maybeSingle();
  if (!data) return { title: 'Categoria' };
  return {
    title: data.nome,
    description: `Produtos da categoria ${data.nome} com curadoria TechIndica.`,
  };
}

export default async function CategoriaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { categoria, produtos, todas } = await load(slug);
  if (!categoria) notFound();

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
            margin: '0 0 8px',
            color: '#0f172a',
            letterSpacing: -0.5,
          }}
        >
          {categoria.nome}
        </h1>
        <p
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 14,
            color: '#64748b',
            margin: '0 0 24px',
          }}
        >
          {produtos.length} produto{produtos.length === 1 ? '' : 's'}
        </p>

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
            Nenhum produto publicado nesta categoria.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {produtos.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        )}
      </main>
      <PublicFooter categorias={todas} />
    </>
  );
}
