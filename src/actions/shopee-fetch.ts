'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

  // 1. Le config do banco; cai pra env vars como fallback
  const configRow = await prisma.affiliateConfig.findUnique({
    where: { plataforma: 'shopee' },
    select: { config: true, ativo: true },
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
    await logExecution('shopee', 'error', 0, 0, 'Credenciais Shopee ausentes');
    return { ok: false, error: 'Credenciais Shopee nao configuradas' };
  }

  // 2. Busca na API
  let produtos;
  try {
    produtos = await fetchShopeeProducts(appId, secret, trackingId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido';
    await logExecution('shopee', 'error', 0, 0, msg);
    return { ok: false, error: msg };
  }

  // 3. Upsert produtos via Prisma (sem publicar; precisa de copy)
  const existingIds = new Set(
    (await prisma.produto.findMany({
      where: { platform_id: { in: produtos.map((p) => p.platform_id) } },
      select: { platform_id: true },
    })).map((r) => r.platform_id),
  );

  let novos = 0;
  let atualizados = 0;
  for (const p of produtos) {
    try {
      await prisma.produto.upsert({
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
          publicado: false,
        },
      });
      if (existingIds.has(p.platform_id)) atualizados++;
      else novos++;
    } catch {
      // produto individual falhou; continua
    }
  }

  // 4. Log
  await logExecution('shopee', 'success', produtos.length, 0, null);

  revalidatePath('/admin/produtos');
  revalidatePath('/admin/automacao');
  revalidatePath('/admin');

  return {
    ok: true,
    data: { encontrados: produtos.length, novos, atualizados },
  };
}

async function logExecution(
  plataforma: string,
  status: 'success' | 'error' | 'partial',
  encontrados: number,
  publicados: number,
  erro: string | null,
) {
  await prisma.execucaoLog.create({
    data: { plataforma, status, produtos_encontrados: encontrados, produtos_publicados: publicados, erro },
  });
}
