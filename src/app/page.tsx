import { prisma, serializeDates } from '@/lib/prisma';
import { ProdutoSchema, CategoriaSchema, PostSchema, type Produto, type Categoria, type Post } from '@/schemas';
import { ProductCard } from '@/components/product/product-card';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';
import Link from 'next/link';

export const revalidate = 60;

async function loadData(): Promise<{
  destaques: Produto[];
  produtos: Produto[];
  categorias: Categoria[];
  posts: Post[];
}> {
  const [destaquesRaw, recentesRaw, catsRaw, postsRaw] = await prisma.$transaction([
    prisma.produto.findMany({ where: { publicado: true, destaque: true }, orderBy: { updated_at: 'desc' }, take: 2 }),
    prisma.produto.findMany({ where: { publicado: true }, orderBy: { updated_at: 'desc' }, take: 9 }),
    prisma.categoria.findMany({ orderBy: { ordem: 'asc' } }),
    prisma.post.findMany({ where: { publicado: true }, orderBy: { created_at: 'desc' }, take: 4 }),
  ]);

  const destaques = destaquesRaw
    .map((p) => ProdutoSchema.safeParse(serializeDates(p)))
    .filter((r) => r.success)
    .map((r) => r.data as Produto);
  const produtos = recentesRaw
    .map((p) => ProdutoSchema.safeParse(serializeDates(p)))
    .filter((r) => r.success)
    .map((r) => r.data as Produto);
  const categorias = catsRaw
    .map((c) => CategoriaSchema.safeParse(serializeDates(c)))
    .filter((r) => r.success)
    .map((r) => r.data as Categoria);
  const posts = postsRaw
    .map((p) => PostSchema.safeParse(serializeDates(p)))
    .filter((r) => r.success)
    .map((r) => r.data as Post);

  return { destaques, produtos, categorias, posts };
}

export default async function HomePage() {
  const { destaques, produtos, categorias, posts } = await loadData();

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

        {posts.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: 'Sora, system-ui, sans-serif',
                fontSize: 22,
                margin: '0 0 16px',
                color: '#0f172a',
              }}
            >
              Curadoria da semana
            </h2>
            <div className="grid-2col">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 14,
                    padding: 20,
                    textDecoration: 'none',
                    color: '#0f172a',
                    display: 'block',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: '3px 9px',
                      borderRadius: 99,
                      marginBottom: 10,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {post.angulo}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'Sora, system-ui, sans-serif',
                      fontSize: 18,
                      margin: '0 0 8px',
                      lineHeight: 1.3,
                    }}
                  >
                    {post.titulo}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontSize: 13.5,
                      color: '#64748b',
                      margin: 0,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.intro}
                  </p>
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11.5,
                      color: '#94a3b8',
                      marginTop: 10,
                    }}
                  >
                    {post.itens.length} produtos selecionados
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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
            <div className="grid-2col">
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
            <div className="grid-3col">
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
