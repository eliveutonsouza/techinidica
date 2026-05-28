'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchShopeePool } from '@/lib/shopee';
import { generateCuratedPost } from '@/lib/openai';
import { SaveShopeeConfigSchema, type ActionResult, type PostItem } from '@/schemas';

type GeneratePostResult = {
  post_id: number;
  slug: string;
  titulo: string;
  itens: number;
};

/**
 * Fluxo completo:
 * 1. Le credenciais Shopee (DB > env fallback)
 * 2. Coleta pool diverso (mais vendidos + melhor avaliados + maior comissao)
 * 3. Upsert produtos no banco (precisa do id pra referenciar)
 * 4. Manda pool pro GPT-4o, que escolhe angulo + seleciona itens + escreve copy
 * 5. Persiste posts, publica e revalida rotas
 *
 * `fonte` = 'cron' quando chamado pelo route handler agendado, 'manual' do admin.
 */
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

  const supabase = createAdminClient();

  // 1. Credenciais
  const { data: configRow } = await supabase
    .from('affiliate_config')
    .select('config')
    .eq('plataforma', 'shopee')
    .maybeSingle();

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
    await logExec(supabase, 'error', 0, 0, 'Credenciais Shopee ausentes');
    return { ok: false, error: 'Credenciais Shopee nao configuradas' };
  }

  // 2. Pool
  let pool;
  try {
    pool = await fetchShopeePool(appId, secret, trackingId, 30);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro Shopee';
    await logExec(supabase, 'error', 0, 0, msg);
    return { ok: false, error: msg };
  }

  if (pool.length < 5) {
    await logExec(supabase, 'error', pool.length, 0, 'Pool insuficiente (<5)');
    return { ok: false, error: `Pool insuficiente: apenas ${pool.length} produtos` };
  }

  // 3. Upsert produtos
  const produtosByPlatformId = new Map<string, number>();
  for (const item of pool) {
    const p = item.fetched;
    const { data: existing } = await supabase
      .from('produtos')
      .select('id')
      .eq('platform_id', p.platform_id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('produtos')
        .update({
          nome: p.nome,
          preco_atual: p.preco_atual,
          preco_original: p.preco_original,
          desconto_pct: p.desconto_pct,
          imagem_url: p.imagem_url,
          link_shopee: p.link_shopee,
        })
        .eq('id', existing.id);
      produtosByPlatformId.set(p.platform_id, existing.id);
    } else {
      const { data: inserted } = await supabase
        .from('produtos')
        .insert({
          plataforma: 'shopee',
          platform_id: p.platform_id,
          nome: p.nome,
          preco_atual: p.preco_atual,
          preco_original: p.preco_original,
          desconto_pct: p.desconto_pct,
          imagem_url: p.imagem_url,
          link_shopee: p.link_shopee,
          publicado: true, // produtos referenciados em post curado sao publicaveis
        })
        .select('id')
        .single();
      if (inserted) produtosByPlatformId.set(p.platform_id, inserted.id);
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
    await logExec(supabase, 'error', pool.length, 0, `Curador: ${msg}`);
    return { ok: false, error: msg };
  }

  // 5. Resolve itens -> produto_id; descarta itens cujo platform_id nao bate
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
    await logExec(
      supabase,
      'error',
      pool.length,
      0,
      `Curador retornou poucos itens validos (${itens.length})`,
    );
    return { ok: false, error: 'Curador retornou poucos itens validos' };
  }

  itens.sort((a, b) => a.posicao - b.posicao);

  // 6. Slug unico
  const slug = await uniqueSlug(supabase, curated.slug);

  const { data: postRow, error: postErr } = await supabase
    .from('posts')
    .insert({
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
    })
    .select('id, slug, titulo')
    .single();

  if (postErr || !postRow) {
    await logExec(supabase, 'error', pool.length, 0, postErr?.message ?? 'Falha ao inserir post');
    return { ok: false, error: postErr?.message ?? 'Falha ao inserir post' };
  }

  await logExec(supabase, 'success', pool.length, itens.length, null);

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
  const supabase = createAdminClient();
  const { error, data } = await supabase
    .from('posts')
    .update({ publicado: value })
    .eq('id', id)
    .select('slug')
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/posts');
  revalidatePath('/');
  if (data?.slug) revalidatePath(`/post/${data.slug}`);
  return { ok: true, data: null };
}

export async function deletePost(id: number): Promise<ActionResult<null>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from('posts').select('slug').eq('id', id).maybeSingle();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/posts');
  revalidatePath('/');
  if (existing?.slug) revalidatePath(`/post/${existing.slug}`);
  return { ok: true, data: null };
}

async function uniqueSlug(
  supabase: ReturnType<typeof createAdminClient>,
  base: string,
): Promise<string> {
  let candidate = base;
  let suffix = 1;
  while (true) {
    const { data } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (!data) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
    if (suffix > 50) return `${base}-${Date.now()}`;
  }
}

async function logExec(
  supabase: ReturnType<typeof createAdminClient>,
  status: 'success' | 'error' | 'partial',
  encontrados: number,
  publicados: number,
  erro: string | null,
) {
  await supabase.from('execucoes_log').insert({
    plataforma: 'shopee-post',
    status,
    produtos_encontrados: encontrados,
    produtos_publicados: publicados,
    erro,
  });
}
