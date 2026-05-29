'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fetchShopeePool } from '@/lib/shopee';
import { generateCuratedPost } from '@/lib/openai';
import { SaveShopeeConfigSchema, type ActionResult, type PostItem } from '@/schemas';

type GeneratePostResult = {
  post_id: number;
  slug: string;
  titulo: string;
  itens: number;
};

export async function generatePost(
  fonte: 'cron' | 'manual' = 'manual',
): Promise<ActionResult<GeneratePostResult>> {
  if (fonte === 'manual') {
    try {
      await requireAuth();
    } catch {
      return { ok: false, error: 'Nao autorizado' };
    }
  }

  // 1. Credenciais
  const configRow = await prisma.affiliateConfig.findUnique({
    where: { plataforma: 'shopee' },
    select: { config: true },
  });

  let appId = process.env.SHOPEE_APP_ID ?? '';
  let secret = process.env.SHOPEE_SECRET ?? '';
  let trackingId = process.env.SHOPEE_TRACKING_ID ?? 'techindica_main';

  if (configRow?.config) {
    const parsed = SaveShopeeConfigSchema.partial().safeParse(configRow.config);
    if (parsed.success) {
      appId = (parsed.data.app_id as string) || appId;
      secret = (parsed.data.secret as string) || secret;
      trackingId = (parsed.data.tracking_id as string) || trackingId;
    }
  }

  if (!appId || !secret) {
    await logExec('error', 0, 0, 'Credenciais Shopee ausentes');
    return { ok: false, error: 'Credenciais Shopee nao configuradas' };
  }

  // 2. Pool
  let pool;
  try {
    pool = await fetchShopeePool(appId, secret, trackingId, 30);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro Shopee';
    await logExec('error', 0, 0, msg);
    return { ok: false, error: msg };
  }

  if (pool.length < 5) {
    await logExec('error', pool.length, 0, 'Pool insuficiente (<5)');
    return { ok: false, error: `Pool insuficiente: apenas ${pool.length} produtos` };
  }

  // 3. Upsert produtos via Prisma
  const produtosByPlatformId = new Map<string, number>();
  for (const item of pool) {
    const p = item.fetched;
    try {
      const row = await prisma.produto.upsert({
        where: { platform_id: p.platform_id },
        update: {
          nome: p.nome,
          preco_atual: p.preco_atual,
          preco_original: p.preco_original ?? null,
          desconto_pct: p.desconto_pct,
          imagem_url: p.imagem_url ?? null,
          link_shopee: p.link_shopee,
        },
        create: {
          plataforma: 'shopee',
          platform_id: p.platform_id,
          nome: p.nome,
          preco_atual: p.preco_atual,
          preco_original: p.preco_original ?? null,
          desconto_pct: p.desconto_pct,
          imagem_url: p.imagem_url ?? null,
          link_shopee: p.link_shopee,
          publicado: true,
        },
        select: { id: true },
      });
      produtosByPlatformId.set(p.platform_id, row.id);
    } catch {
      // produto individual falhou; continua
    }
  }

  // 4. Curador IA
  let curated;
  try {
    curated = await generateCuratedPost(
      pool.map((it) => ({
        platform_id: it.fetched.platform_id,
        nome: it.fetched.nome,
        preco_atual: it.fetched.preco_atual,
        rating: it.raw.ratingStar,
        sales: it.raw.sales,
        commission_rate: it.raw.commissionRate,
      })),
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro GPT-4o';
    await logExec('error', pool.length, 0, `Curador: ${msg}`);
    return { ok: false, error: msg };
  }

  // 5. Resolve itens -> produto_id
  const itens: PostItem[] = [];
  const produtoIds: number[] = [];
  for (const it of curated.itens) {
    const produtoId = produtosByPlatformId.get(it.platform_id);
    const pool_item = pool.find((p) => p.fetched.platform_id === it.platform_id);
    if (!produtoId || !pool_item) continue;
    itens.push({
      produto_id: produtoId,
      posicao: it.posicao,
      titulo_item: it.titulo_item,
      resumo: it.resumo,
      destaque: it.destaque,
      link: pool_item.fetched.link_shopee,
    });
    produtoIds.push(produtoId);
  }

  if (itens.length < 3) {
    await logExec('error', pool.length, 0, `Curador retornou poucos itens validos (${itens.length})`);
    return { ok: false, error: 'Curador retornou poucos itens validos' };
  }

  itens.sort((a, b) => a.posicao - b.posicao);

  // 6. Slug unico + insert post
  const slug = await uniqueSlug(curated.slug);

  let postRow;
  try {
    postRow = await prisma.post.create({
      data: {
        slug,
        titulo: curated.titulo,
        subtitulo: curated.subtitulo ?? null,
        intro: curated.intro,
        conclusao: curated.conclusao,
        angulo: curated.angulo,
        categoria: curated.categoria,
        produto_ids: produtoIds,
        itens,
        fonte,
        publicado: true,
      },
      select: { id: true, slug: true, titulo: true },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Falha ao inserir post';
    await logExec('error', pool.length, 0, msg);
    return { ok: false, error: msg };
  }

  await logExec('success', pool.length, itens.length, null);

  revalidatePath('/');
  revalidatePath('/admin/posts');
  revalidatePath('/admin/automacao');
  revalidatePath(`/post/${postRow.slug}`);

  return {
    ok: true,
    data: {
      post_id: postRow.id,
      slug: postRow.slug,
      titulo: postRow.titulo,
      itens: itens.length,
    },
  };
}

export async function togglePostPublicado(id: number, value: boolean): Promise<ActionResult<null>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { publicado: value },
      select: { slug: true },
    });
    revalidatePath('/admin/posts');
    revalidatePath('/');
    revalidatePath(`/post/${post.slug}`);
    return { ok: true, data: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Erro' };
  }
}

export async function deletePost(id: number): Promise<ActionResult<null>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }
  const existing = await prisma.post.findUnique({ where: { id }, select: { slug: true } });
  try {
    await prisma.post.delete({ where: { id } });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Erro' };
  }
  revalidatePath('/admin/posts');
  revalidatePath('/');
  if (existing?.slug) revalidatePath(`/post/${existing.slug}`);
  return { ok: true, data: null };
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let suffix = 1;
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
    if (suffix > 50) return `${base}-${Date.now()}`;
  }
}

async function logExec(
  status: 'success' | 'error' | 'partial',
  encontrados: number,
  publicados: number,
  erro: string | null,
) {
  await prisma.execucaoLog.create({
    data: { plataforma: 'shopee-post', status, produtos_encontrados: encontrados, produtos_publicados: publicados, erro },
  });
}
