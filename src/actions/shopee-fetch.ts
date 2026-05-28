'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchShopeeProducts } from '@/lib/shopee';
import { SaveShopeeConfigSchema, type ActionResult } from '@/schemas';

type FetchResult = {
  encontrados: number;
  novos: number;
  atualizados: number;
};

export async function runShopeeFetch(): Promise<ActionResult<FetchResult>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  const supabase = createAdminClient();

  // 1. Le config do banco; cai pra env vars como fallback
  const { data: configRow } = await supabase
    .from('affiliate_config')
    .select('config, ativo')
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
    await logExecution(supabase, 'shopee', 'error', 0, 0, 'Credenciais Shopee ausentes');
    return { ok: false, error: 'Credenciais Shopee nao configuradas' };
  }

  // 2. Busca na API
  let produtos;
  try {
    produtos = await fetchShopeeProducts(appId, secret, trackingId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido';
    await logExecution(supabase, 'shopee', 'error', 0, 0, msg);
    return { ok: false, error: msg };
  }

  // 3. Upsert produtos (sem publicar; precisa de copy)
  let novos = 0;
  let atualizados = 0;
  for (const p of produtos) {
    const { data: existing } = await supabase
      .from('produtos')
      .select('id')
      .eq('platform_id', p.platform_id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('produtos')
        .update({
          nome: p.nome,
          preco_atual: p.preco_atual,
          preco_original: p.preco_original,
          desconto_pct: p.desconto_pct,
          imagem_url: p.imagem_url,
          link_shopee: p.link_shopee,
        })
        .eq('platform_id', p.platform_id);
      if (!error) atualizados++;
    } else {
      const { error } = await supabase.from('produtos').insert({
        plataforma: 'shopee',
        platform_id: p.platform_id,
        nome: p.nome,
        preco_atual: p.preco_atual,
        preco_original: p.preco_original,
        desconto_pct: p.desconto_pct,
        imagem_url: p.imagem_url,
        link_shopee: p.link_shopee,
        publicado: false,
      });
      if (!error) novos++;
    }
  }

  // 4. Log
  await logExecution(supabase, 'shopee', 'success', produtos.length, 0, null);

  revalidatePath('/admin/produtos');
  revalidatePath('/admin/automacao');
  revalidatePath('/admin');

  return {
    ok: true,
    data: { encontrados: produtos.length, novos, atualizados },
  };
}

async function logExecution(
  supabase: ReturnType<typeof createAdminClient>,
  plataforma: string,
  status: 'success' | 'error' | 'partial',
  encontrados: number,
  publicados: number,
  erro: string | null,
) {
  await supabase.from('execucoes_log').insert({
    plataforma,
    status,
    produtos_encontrados: encontrados,
    produtos_publicados: publicados,
    erro,
  });
}
