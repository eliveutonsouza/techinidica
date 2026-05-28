import { createClient } from '@/lib/supabase/server';
import { ProdutoSchema, CategoriaSchema, type Produto, type Categoria } from '@/schemas';
import { ProductCard } from '@/components/product/product-card';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';
import Link from 'next/link';

export const revalidate = 60;

async function loadData(): Promise<{ destaques: Produto[]; produtos: Produto[]; categorias: Categoria[] }> {
  const supabase = await createClient();
  const [destaquesRes, recentesRes, catsRes] = await Promise.all([
    supabase
      .from('produtos')
      .select('*')
      .eq('publicado', true)
      .eq('destaque', true)
      .order('updated_at', { ascending: false })
      .limit(2),
    supabase
      .from('produtos')
      .select('*')
      .eq('publicado', true)
      .order('updated_at', { ascending: false })
      .limit(9),
    supabase.from('categorias').select('*').order('ordem'),
  ]);

  const destaques = (destaquesRes.data ?? [])
    .map((p) => ProdutoSchema.safeParse(p))
    .filter((r) => r.success)
    .map((r) => r.data as Produto);
  const produtos = (recentesRes.data ?? [])
    .map((p) => ProdutoSchema.safeParse(p))
    .filter((r) => r.success)
    .map((r) => r.data as Produto);
  const categorias = (catsRes.data ?? [])
    .map((c) => CategoriaSchema.safeParse(c))
    .filter((r) => r.success)
    .map((r) => r.data as Categoria);

  return { destaques, produtos, categorias };
}

export default async function HomePage() {
  const { destaques, produtos, categorias } = await loadData();

  return (
    <>
      <PublicHeader categorias={categorias} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <section style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: 'Sora, system-ui, sans-serif',
              fontSize: 36,
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 12px',
              letterSpacing: -1,
              maxWidth: 720,
              lineHeight: 1.2,
            }}
          >
            Tecnologia com recomendacao honesta e link direto pra comprar.
          </h1>
          <p
            style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 16,
              color: '#475569',
              maxWidth: 620,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Smartwatches, fones, notebooks e mais. Curadoria com nota, pros, contras e links
            de afiliado Shopee/Mercado Livre.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {categorias.map((c) => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                style={{
                  padding: '8px 14px',
                  borderRadius: 99,
                  background: '#f1f5f9',
                  color: '#0f172a',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {c.nome}
              </Link>
            ))}
          </div>
        </section>

        {destaques.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: 'Sora, system-ui, sans-serif',
                fontSize: 22,
                margin: '0 0 16px',
                color: '#0f172a',
              }}
            >
              Destaques
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {destaques.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2
            style={{
              fontFamily: 'Sora, system-ui, sans-serif',
              fontSize: 22,
              margin: '0 0 16px',
              color: '#0f172a',
            }}
          >
            Mais recentes
          </h2>
          {produtos.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {produtos.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </section>
      </main>
      <PublicFooter categorias={categorias} />
    </>
  );
}

function EmptyState() {
  return (
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
      Nenhum produto publicado ainda. Acesse <code>/admin</code> para configurar a coleta
      Shopee e gerar copies via GPT-4o.
    </div>
  );
}
