import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma, serializeDates } from '@/lib/prisma';
import { ProdutoSchema, CategoriaSchema, type Produto, type Categoria } from '@/schemas';
import { ProductImage } from '@/components/product/product-image';
import { BuyButtons } from '@/components/product/buy-buttons';
import { ProductBadge } from '@/components/ui/badge';
import { AffiliateDisclosure } from '@/components/product/affiliate-disclosure';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';
import { Icon } from '@/components/ui/icon';

export const revalidate = 60;

type Params = Promise<{ id: string }>;

async function load(id: string): Promise<{ produto: Produto | null; categorias: Categoria[] }> {
  const [prodRaw, catsRaw] = await prisma.$transaction([
    prisma.produto.findFirst({ where: { id: Number(id), publicado: true } }),
    prisma.categoria.findMany({ orderBy: { ordem: 'asc' } }),
  ]);
  const parsed = prodRaw ? ProdutoSchema.safeParse(serializeDates(prodRaw)) : null;
  const categorias = catsRaw
    .map((c) => CategoriaSchema.safeParse(serializeDates(c)))
    .filter((r) => r.success)
    .map((r) => r.data as Categoria);
  return { produto: parsed?.success ? parsed.data : null, categorias };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const data = await prisma.produto.findFirst({
    where: { id: Number(id), publicado: true },
    select: { nome: true, descricao_curta: true, imagem_url: true },
  });
  if (!data) return { title: 'Produto' };
  return {
    title: `${data.nome} — Vale a pena? Análise completa`,
    description: data.descricao_curta
      ? `${data.descricao_curta} Veja a ficha técnica completa, prós e contras e compare preços na Shopee e Mercado Livre.`
      : `Análise técnica completa com especificações, prós, contras e onde comprar pelo menor preço.`,
    openGraph: {
      title: `${data.nome} | TechIndica`,
      description: data.descricao_curta ?? undefined,
      images: data.imagem_url ? [{ url: data.imagem_url, width: 800, height: 800 }] : undefined,
    },
  };
}

export default async function ProdutoPage({ params }: { params: Params }) {
  const { id } = await params;
  const { produto, categorias } = await load(id);
  if (!produto) notFound();

  return (
    <>
      <PublicHeader categorias={categorias} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="grid-produto">
          <div className="produto-sticky">
            <ProductImage
              categoria={produto.categoria}
              imagemUrl={produto.imagem_url}
              height={420}
              rounded={14}
            />
          </div>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
              {produto.badge && <ProductBadge kind={produto.badge} size="md" />}
              {produto.nota != null && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                    color: '#0f172a',
                    fontWeight: 600,
                  }}
                >
                  <Icon name="star" size={14} style={{ color: '#f59e0b' }} />
                  {Number(produto.nota).toFixed(1)}/10
                </span>
              )}
            </div>
            <h1
              style={{
                fontFamily: 'Sora, system-ui, sans-serif',
                fontSize: 28,
                margin: '0 0 12px',
                color: '#0f172a',
                lineHeight: 1.25,
              }}
            >
              {produto.nome}
            </h1>
            {produto.descricao_curta && (
              <p
                style={{
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontSize: 15,
                  color: '#475569',
                  margin: '0 0 20px',
                  lineHeight: 1.5,
                }}
              >
                {produto.descricao_curta}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: 'Sora, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: 32,
                  color: '#0f172a',
                }}
              >
                R$ {Number(produto.preco_atual).toFixed(2).replace('.', ',')}
              </span>
              {produto.preco_original != null && produto.preco_original > produto.preco_atual && (
                <span
                  style={{
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    fontSize: 16,
                    color: '#94a3b8',
                    textDecoration: 'line-through',
                  }}
                >
                  R$ {Number(produto.preco_original).toFixed(2).replace('.', ',')}
                </span>
              )}
              {produto.desconto_pct >= 10 && (
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 99,
                  }}
                >
                  -{produto.desconto_pct}%
                </span>
              )}
            </div>
            <BuyButtons produto={produto} size="md" />
            <div style={{ marginTop: 16 }}>
              <AffiliateDisclosure />
            </div>
          </div>
        </div>

        {produto.copy_gerada && (
          <section style={{ marginTop: 48 }}>
            <h2
              style={{
                fontFamily: 'Sora, system-ui, sans-serif',
                fontSize: 22,
                margin: '0 0 12px',
                color: '#0f172a',
              }}
            >
              Por que recomendamos
            </h2>
            <p
              style={{
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: 15,
                color: '#334155',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
                margin: 0,
                maxWidth: 760,
              }}
            >
              {produto.copy_gerada}
            </p>
          </section>
        )}

        {Object.keys(produto.specs ?? {}).length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2
              style={{
                fontFamily: 'Sora, system-ui, sans-serif',
                fontSize: 22,
                margin: '0 0 12px',
                color: '#0f172a',
              }}
            >
              Ficha tecnica
            </h2>
            <div className="specs-table-wrap">
            <table
              style={{
                width: '100%',
                maxWidth: 600,
                borderCollapse: 'collapse',
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: 14,
                minWidth: 280,
              }}
            >
              <tbody>
                {Object.entries(produto.specs).map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', color: '#64748b', width: '40%' }}>{k}</td>
                    <td style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 500 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        )}

        {(produto.pros.length > 0 || produto.contras.length > 0) && (
          <section className="grid-pros-contras" style={{ marginTop: 40 }}>
            <div>
              <h3
                style={{
                  fontFamily: 'Sora, system-ui, sans-serif',
                  fontSize: 16,
                  margin: '0 0 12px',
                  color: '#15803d',
                }}
              >
                Pros
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {produto.pros.map((p, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'flex-start',
                      marginBottom: 8,
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontSize: 14,
                      color: '#334155',
                    }}
                  >
                    <Icon name="check" size={14} strokeWidth={3} style={{ color: '#16a34a', marginTop: 3, flexShrink: 0 }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'Sora, system-ui, sans-serif',
                  fontSize: 16,
                  margin: '0 0 12px',
                  color: '#b91c1c',
                }}
              >
                Contras
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {produto.contras.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'flex-start',
                      marginBottom: 8,
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontSize: 14,
                      color: '#334155',
                    }}
                  >
                    <Icon name="x" size={14} strokeWidth={3} style={{ color: '#dc2626', marginTop: 3, flexShrink: 0 }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <PublicFooter categorias={categorias} />
    </>
  );
}
