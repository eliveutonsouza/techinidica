import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma, serializeDates } from '@/lib/prisma';
import { PostSchema, CategoriaSchema, ProdutoSchema, type Post, type Categoria, type Produto } from '@/schemas';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';
import { ProductImage } from '@/components/product/product-image';
import { AffiliateDisclosure } from '@/components/product/affiliate-disclosure';

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

async function load(
  slug: string,
): Promise<{ post: Post | null; produtos: Map<number, Produto>; categorias: Categoria[] }> {
  const [postRaw, catsRaw] = await Promise.all([
    prisma.post.findFirst({ where: { slug, publicado: true } }),
    prisma.categoria.findMany({ orderBy: { ordem: 'asc' } }),
  ]);
  const parsed = postRaw ? PostSchema.safeParse(serializeDates(postRaw)) : null;
  const post = parsed?.success ? parsed.data : null;
  const categorias = catsRaw
    .map((c) => CategoriaSchema.safeParse(serializeDates(c)))
    .filter((r) => r.success)
    .map((r) => r.data as Categoria);

  const produtos = new Map<number, Produto>();
  if (post && post.produto_ids.length > 0) {
    const prodsRaw = await prisma.produto.findMany({
      where: { id: { in: post.produto_ids as number[] } },
    });
    for (const row of prodsRaw) {
      const r = ProdutoSchema.safeParse(serializeDates(row));
      if (r.success) produtos.set(r.data.id, r.data);
    }
  }
  return { post, produtos, categorias };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await prisma.post.findFirst({
    where: { slug, publicado: true },
    select: { titulo: true, subtitulo: true, intro: true },
  });
  if (!data) return { title: 'Post' };
  const description = data.subtitulo ?? data.intro?.slice(0, 160);
  return {
    title: data.titulo,
    description,
    openGraph: {
      title: `${data.titulo} | TechIndica`,
      description: description ?? undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { post, produtos, categorias } = await load(slug);
  if (!post) notFound();

  return (
    <>
      <PublicHeader categorias={categorias} />
      <main style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px' }}>
        <span
          style={{
            display: 'inline-block',
            background: '#eff6ff',
            color: '#1d4ed8',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 99,
            marginBottom: 14,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {post.angulo}
        </span>
        <h1
          style={{
            fontFamily: 'Sora, system-ui, sans-serif',
            fontSize: 36,
            lineHeight: 1.2,
            color: '#0f172a',
            margin: '0 0 12px',
          }}
        >
          {post.titulo}
        </h1>
        {post.subtitulo && (
          <p
            style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 18,
              color: '#475569',
              margin: '0 0 16px',
              lineHeight: 1.5,
            }}
          >
            {post.subtitulo}
          </p>
        )}
        <p
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 16,
            color: '#334155',
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
            margin: '0 0 32px',
          }}
        >
          {post.intro}
        </p>

        <AffiliateDisclosure />

        <section style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {post.itens.map((item) => {
            const produto = produtos.get(item.produto_id);
            return (
              <article
                key={item.produto_id}
                className="grid-post-item"
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <div>
                  <ProductImage
                    categoria={produto?.categoria ?? post.categoria}
                    imagemUrl={produto?.imagem_url ?? null}
                    height={160}
                    rounded={10}
                  />
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 6,
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                      color: '#64748b',
                    }}
                  >
                    #{item.posicao}
                    {produto?.preco_atual != null && produto.preco_atual > 0 && (
                      <span style={{ color: '#0f172a', fontWeight: 600 }}>
                        R$ {Number(produto.preco_atual).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontFamily: 'Sora, system-ui, sans-serif',
                      fontSize: 18,
                      color: '#0f172a',
                      margin: '0 0 6px',
                    }}
                  >
                    {item.titulo_item}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontSize: 14,
                      color: '#334155',
                      lineHeight: 1.6,
                      margin: '0 0 10px',
                    }}
                  >
                    {item.resumo}
                  </p>
                  <p
                    style={{
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontSize: 13,
                      color: '#1e293b',
                      lineHeight: 1.5,
                      margin: '0 0 14px',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderLeft: '3px solid #3b82f6',
                      borderRadius: 6,
                    }}
                  >
                    {item.destaque}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#f05d23',
                      color: '#fff',
                      padding: '9px 16px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontWeight: 600,
                      fontSize: 13.5,
                    }}
                  >
                    Ver na Shopee
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        {post.conclusao && (
          <section style={{ marginTop: 32 }}>
            <p
              style={{
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: 16,
                color: '#334155',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
                margin: 0,
              }}
            >
              {post.conclusao}
            </p>
          </section>
        )}
      </main>
      <PublicFooter categorias={categorias} />
    </>
  );
}
